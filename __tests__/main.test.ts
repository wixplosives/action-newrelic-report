import {join} from 'path'
import {loadLocalMetricsFromFile} from '../src/report'

const fixturesRoot = '__tests__/fixtures'

test('url parser', async () => {
  const metrics: Record<string, number> = {}
  const metricsPath = join(fixturesRoot, 'measure_result.json')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  Object.assign(metrics, await loadLocalMetricsFromFile(metricsPath))

  expect(metrics['bundle_time_duration']).toBe(22488)
  expect(metrics['launching_node_environment']).toBe(2062)
})
