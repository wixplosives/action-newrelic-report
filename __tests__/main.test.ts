import {join} from 'path'
import {loadLocalMetricsFromFile, LocalMetrics} from '../src/report'

const fixturesRoot = '__tests__/fixtures'

test('url parser', async () => {
  const metrics: LocalMetrics = {}
  const metricsPath = join(fixturesRoot, 'measure_result.json')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  Object.assign(metrics, await loadLocalMetricsFromFile(metricsPath))

  expect(metrics['bundle_time_duration']['regularAvg']).toBe(47018)
  expect(metrics['bundle_time_duration']['normalizedAvg']).toBe(47018)
  expect(metrics['launching_node_environment']['regularAvg']).toBe(1644.4)
  expect(metrics['launching_node_environment']['normalizedAvg']).toBe(889.75)
  expect(metrics['launching_node_environment']['normalizedObs']).toBe(4)
})
