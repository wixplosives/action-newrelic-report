import {fetchText} from './http'
import fs from 'fs'

export type NewrelicMetrics = Record<string, number>
//NewrelicMetrics[]
function convertMetricsListToNRQL(metrics: string[]): string {
  const list: string[] = []
  for (const entry of metrics) {
    list.push(`latest(${entry})`)
  }
  const subQuery = list.join(',')
  const query = `SELECT ${subQuery} from measurement since 1 weeks ago where commit is not null and appName = 'component-studio' and os != 'darwin'`

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
  for (let i = 0; i < results.metadata.contents.length; i++) {
    const value = results.results[i].latest
    const name = results.metadata.contents[i].attribute
    metrics[name] = value
  }
  return metrics
}

async function getMetrics(
  newrelicAccountId: string,
  newrelicQueryKey: string,
  metrics: string[]
): Promise<NewrelicMetrics> {
  const querySelector = convertMetricsListToNRQL(metrics)
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
  const fileContent = (await fileExists(filePath))
    ? await fs.promises.readFile(filePath, 'utf8')
    : undefined
  const metrics: Record<string, number> = {}
  if (fileContent) {
    const rawMetrics = JSON.parse(fileContent) as WcsMeasureResults
    metrics['bundle_time_duration'] = rawMetrics.bundleTime
    for (const k in rawMetrics.avg) {
      const newRelicKeyName = k.replace(/ /g, '_')
      metrics[newRelicKeyName] = rawMetrics.avg[k]
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(`No file: Current directory: ${process.cwd()}`)
  }

  return metrics
}

export function getListOfMetrcis(metricsList: NewrelicMetrics): string[] {
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
  metrics: NewrelicMetrics
): Promise<NewrelicMetrics> {
  let retval: NewrelicMetrics = {}
  if (metrics) {
    const listOfMetrcis = getListOfMetrcis(metrics)
    retval = await getMetrics(nrAccountID, nrQueryKey, listOfMetrcis)
  }
  return retval
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
    '| Test | Duration(ms) | Latest From NewRelic (ms)| Change (ms)'
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
  nrQueryKey: string
): Promise<string> {
  const localMetrics = await loadLocalMetricsFromFile(localMetricsFileName)
  if (localMetrics) {
    const newRelicMetrics = await getNewRelicDataForMetrics(
      nrAccountID,
      nrQueryKey,
      localMetrics
    )
    if (newRelicMetrics) {
      const report = makeMDReportStringForMetrics(localMetrics, newRelicMetrics)
      return report
    }
  }
  return ''
}
