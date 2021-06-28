import {join} from 'path'
import {loadLocalMetricsFromFile, LocalMetrics} from '../src/report'

const fixturesRoot = '__tests__/fixtures'

test('url parser', async () => {
  const metrics: LocalMetrics = {}
  const metricsPath = join(fixturesRoot, 'measure_result.json')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  Object.assign(metrics, await loadLocalMetricsFromFile(metricsPath))

  expect(metrics['bundle_time_duration']['avg']).toBe(27388)
  expect(metrics['bundle_time_duration']['normalizedAvg']).toBe(27388)
  expect(metrics['launching_node_environment']['avg']).toBe(1039)
  expect(metrics['launching_node_environment']['normalizedAvg']).toBe(534)
  expect(metrics['launching_node_environment']['normalizedObs']).toBe(2)
})
