import {fetchText} from './http'
import fs from 'fs'
import * as core from '@actions/core'

export type NewrelicMetrics = Record<string, number>
//NewrelicMetrics[]
function convertMetricsListToNRQL(metrics: string[], os: string): string {
  const list: string[] = []
  for (const entry of metrics) {
    list.push(`average(${entry})`)
  }
  os = standardizeOS(os)
  const subQuery = list.join(',')
  const query = `SELECT ${subQuery} from measurement since 1 weeks ago where commit is not null and appName = 'component-studio' and os = ${os}`

  return query
}

export interface NewRelicResultEntry {
  latest: number | undefined
}

function parseNewrelicMetrics(rawData: string): NewrelicMetrics {
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
): Promise<NewrelicMetrics> {
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
  avg: Record<string, number>
}

export async function loadLocalMetricsFromFile(
  filePath: string
): Promise<NewrelicMetrics | undefined> {
  core.info(`Loading ${filePath}`)
  const fileContent = (await fileExists(filePath))
    ? await fs.promises.readFile(filePath, 'utf8')
    : undefined
  const metrics: Record<string, number> = {}
  if (fileContent) {
    const rawMetrics = JSON.parse(fileContent) as WcsMeasureResults
    if (rawMetrics) {
      metrics['bundle_time_duration'] = rawMetrics.bundleTime
      for (const k in rawMetrics.avg) {
        const newRelicKeyName = k.replace(/ /g, '_')
        metrics[newRelicKeyName] = rawMetrics.avg[k]
      }
    } else {
      throw new Error(`Cannot parse WcsMeasureResults for \n ${fileContent}`)
    }
  } else {
    throw new Error(`File not found ${filePath}`)
  }

  return metrics
}

export function getListOfMetrics(metricsList: NewrelicMetrics): string[] {
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
  metrics: NewrelicMetrics,
  os: string
): Promise<NewrelicMetrics> {
  if (metrics) {
    core.info(`Get NewRelic data for ${Object.keys(metrics).length} metrics`)
    const listOfMetrcis = getListOfMetrics(metrics)
    return await getMetrics(nrAccountID, nrQueryKey, listOfMetrcis, os)
  } else {
    throw Error('Empty metrics list')
  }
}

export function calcChangeForMetrics(
  metrics: NewrelicMetrics,
  nrValues: NewrelicMetrics
): Record<string, number> {
  const retval: Record<string, number> = {}
  for (const k in metrics) {
    const localMetricVal = metrics[k]
    const nrValue = nrValues[k]
    const change = Math.round((localMetricVal / nrValue - 1) * 100)
    retval[k] = change
  }
  return retval
}

export function makeMDReportStringForMetrics(
  localMetrics: NewrelicMetrics,
  newrelicLatest: NewrelicMetrics
): string {
  const comparison = calcChangeForMetrics(localMetrics, newrelicLatest)
  const reportRows = new Array('')
  reportRows.push(
    '| Test | Duration(ms) | Average From NewRelic (ms)| Change (ms)'
  )
  reportRows.push('|----|---:|---:|---:|')
  for (const k in localMetrics) {
    reportRows.push(
      `|${k}| ${localMetrics[k]}| ${newrelicLatest[k]}| ${comparison[k]}%`
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
      const report = makeMDReportStringForMetrics(localMetrics, newRelicMetrics)
      return report
    }
  }
  return ''
}

export function standardizeOS(os: string): string {
  if (os.includes('windows')) {
    return 'win32'
  }
  if (os.includes('linux')) {
    return 'linux'
  }
  if (os.includes('mac')) {
    return 'darwin'
  }
  throw new Error('Could not find specified OS')
}
