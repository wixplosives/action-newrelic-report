import {fetchText} from './http'
import fs from 'fs'
import * as core from '@actions/core'

export type NewRelicMetrics = Record<string, number>
export type LocalMetrics = {[key: string]: {[key: string]: number}}

function convertMetricsListToNRQL(metrics: string[], os: string): string {
  const list: string[] = []
  for (const entry of metrics) {
    list.push(`average(${entry})`)
  }
  const subQuery = list.join(',')
  const query = `SELECT ${subQuery} from measurement since 1 weeks ago where commit is not null and appName = 'component-studio' and os = '${os}'`

  return query
}

export interface NewRelicResultEntry {
  latest: number | undefined
}

function parseNewrelicMetrics(rawData: string): NewRelicMetrics {
  const metrics: Record<string, number> = {}
  const results = JSON.parse(rawData) as {
    results: Record<string, number>[]
    metadata: {contents: {attribute: string}[]}
  }
  if (results) {
    for (let i = 0; i < results.metadata.contents.length; i++) {
      const value = Math.round(results.results[i].average)
      const name = results.metadata.contents[i].attribute
      metrics[name] = value
    }
  } else {
    throw Error('Cannot parse raw data \n ${rawData}')
  }
  return metrics
}

async function getMetrics(
  newrelicAccountId: string,
  newrelicQueryKey: string,
  metrics: string[],
  os: string
): Promise<NewRelicMetrics> {
  const querySelector = convertMetricsListToNRQL(metrics, os)
  const urlWithQuery = `https://insights-api.newrelic.com/v1/accounts/${newrelicAccountId}/query?nrql=${querySelector}`

  const encoded = encodeURI(urlWithQuery)
  const result = await fetchText(encoded, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Query-Key': newrelicQueryKey
    }
  })

  const parsedResults = parseNewrelicMetrics(result)
  return parsedResults
}

export async function fileExists(filePath: fs.PathLike): Promise<boolean> {
  try {
    return (await fs.promises.stat(filePath)).isFile()
  } catch {
    return false
  }
}

export interface WcsMeasureResults {
  bundleTime: number
  sum: Record<string, number>
  max: Record<string, number>
  min: Record<string, number>
  regularAvg: Record<string, number>
  avg: {[key: string]: {[key: string]: number}}
}

export async function loadLocalMetricsFromFile(
  filePath: string
): Promise<LocalMetrics | undefined> {
  core.info(`Loading ${filePath}`)
  const fileContent = (await fileExists(filePath))
    ? await fs.promises.readFile(filePath, 'utf8')
    : undefined
  const metrics: {[key: string]: {[key: string]: number}} = {}
  if (fileContent) {
    const rawMetrics = JSON.parse(fileContent) as WcsMeasureResults
    if (rawMetrics) {
      metrics['bundle_time_duration'] = {
        regularAvg: rawMetrics.bundleTime,
        normalizedAvg: rawMetrics.bundleTime,
        normalizedObs: 1
      }
      for (const k in rawMetrics.regularAvg) {
        const newRelicKeyName = k.replace(/ /g, '_')
        metrics[newRelicKeyName] = {
          regularAvg: rawMetrics.regularAvg[k],
          normalizedAvg: rawMetrics.avg[k]['duration'],
          normalizedObs: rawMetrics.avg[k]['observations']
        }
      }
    } else {
      throw new Error(`Cannot parse WcsMeasureResults for \n ${fileContent}`)
    }
  } else {
    throw new Error(`File not found ${filePath}`)
  }

  return metrics
}

export function getListOfMetrics(metricsList: LocalMetrics): string[] {
  const retval: string[] = []
  for (const k in metricsList) {
    const metrics_name = k.replace(/ /g, '_')
    retval.push(metrics_name)
  }
  return retval
}

export async function getNewRelicDataForMetrics(
  nrAccountID: string,
  nrQueryKey: string,
  metrics: LocalMetrics,
  os: string
): Promise<Record<string, number>> {
  if (metrics) {
    core.info(`Get NewRelic data for ${Object.keys(metrics).length} metrics`)
    const listOfMetrics = getListOfMetrics(metrics)
    return await getMetrics(nrAccountID, nrQueryKey, listOfMetrics, os)
  } else {
    throw Error('Empty metrics list')
  }
}

export function calcChangeForMetrics(
  metrics: LocalMetrics,
  nrValues: NewRelicMetrics
): Record<string, Record<string, number>> {
  const changes: Record<string, Record<string, number>> = {}
  for (const k in metrics) {
    changes[k] = {
      regularAvg: Math.round(
        (metrics[k]['regularAvg'] / nrValues[k] - 1) * 100
      ),
      normalizedAvg: Math.round(
        (metrics[k]['normalizedAvg'] / nrValues[k] - 1) * 100
      )
    }
  }
  return changes
}

export function makeMDReportStringForMetrics(
  localMetrics: LocalMetrics,
  newrelicLatest: NewRelicMetrics,
  os: string
): string {
  const changes = calcChangeForMetrics(localMetrics, newrelicLatest)
  const reportRows = new Array('')
  reportRows.push(
    `Normalized Avg: If the highest result of a measurement is higher than the second highest * 2, the highest result is removed. `
  )
  reportRows.push(
    `| Test (${os}) | Regular Avg (ms) | Normalized Avg (ms) / Obs (n)| Average From NewRelic (ms)| Change % (Regular Avg)|Change % (Normalized Avg)|`
  )
  reportRows.push('|----|---:|---:|---:|---:|---:|')
  for (const k in localMetrics) {
    const roundedNormalizedAvg = Math.round(localMetrics[k]['normalizedAvg'])
    const roundedAvg = Math.round(localMetrics[k]['regularAvg'])
    reportRows.push(
      `|${k}|${roundedAvg}|${roundedNormalizedAvg} / ${localMetrics[k]['normalizedObs']} |${newrelicLatest[k]}|${changes[k]['regularAvg']}%|${changes[k]['normalizedAvg']}%|`
    )
  }
  return reportRows.join('\n')
}

export async function generateReport(
  localMetricsFileName: string,
  nrAccountID: string,
  nrQueryKey: string,
  os: string
): Promise<string> {
  os = standardizeOS(os)
  const localMetrics = await loadLocalMetricsFromFile(localMetricsFileName)
  if (localMetrics) {
    const len = Object.keys(localMetrics).length
    core.info(`Found ${len} metrics in ${localMetricsFileName}`)
    const newRelicMetrics = await getNewRelicDataForMetrics(
      nrAccountID,
      nrQueryKey,
      localMetrics,
      os
    )
    if (newRelicMetrics) {
      const report = makeMDReportStringForMetrics(
        localMetrics,
        newRelicMetrics,
        os
      )
      return report
    }
  }
  return ''
}

export function standardizeOS(os: string): string {
  if (os.includes('windows')) {
    return 'win32'
  }
  if (os.includes('linux') || os.includes('ubuntu')) {
    return 'linux'
  }
  if (os.includes('mac')) {
    return 'darwin'
  }
  throw new Error('Could not find specified OS')
}
