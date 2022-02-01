import {recordCustomEvent} from 'newrelic'

interface INewrelicReportOptions {
  packageName: string
  packageVersion: string
  gitCommitSha: string | undefined
  githubUrl: string | undefined
  os: string | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function publishResultsToNewrelic(
  reportParams: INewrelicReportOptions,
  records: Record<string, string | number>
) {
  const newrelicMetrics: Record<string, string | number> = {}
  newrelicMetrics['app_name'] = reportParams.packageName
  newrelicMetrics['app_version'] = reportParams.packageVersion

  newrelicMetrics['commit'] = reportParams.gitCommitSha ?? 'undefined'
  if (reportParams.githubUrl && reportParams.gitCommitSha) {
    newrelicMetrics[
      'commit_link'
    ] = `${reportParams.githubUrl}/commit/${reportParams.gitCommitSha}`
  }
  newrelicMetrics['os'] = reportParams.os ? reportParams.os : 'undefined'
  //key names can contain spaces, newrelic metrics do not support spaces in field names. We will replace spaces with underscore symbols.
  for (const [key, value] of Object.entries(records)) {
    const itemNameToSet = key.replace(/ /g, '_')
    newrelicMetrics[itemNameToSet] = value
  }
  // eslint-disable-next-line no-console
  console.log('Publish to newrelic', newrelicMetrics)
  recordCustomEvent('measurement', newrelicMetrics)
}
