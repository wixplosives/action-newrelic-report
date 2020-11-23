import * as core from '@actions/core'
import fs from 'fs'
import {generateReport} from './report'

async function run(): Promise<void> {
  try {
    const inputFile: string = core.getInput('inpit_file')
    const queryKey: string = core.getInput('nr_query_id')
    const accountId: string = core.getInput('nr_account_id')

    //const queryKey = 'NRIQ-nnXX46i5SjmqLp_oc7XhgqqZiKq97Jv_'
    //const accountId = '23428'
    //const inputFile = '/Users/alexshe/dev/newrelic-toolkit/packages/newrelic-cli/test/fixtures/measure_result.json'
    const mdReport = await generateReport(inputFile, accountId, queryKey)
    core.setOutput('data', mdReport)
  } catch (error) {
    core.setFailed(error.message)
  }
}

export async function readDataFromJsonFile(
  filePath: string
): Promise<Record<string, string | number> | undefined> {
  const newrelicMetrics: Record<string, string | number> = {}
  try {
    if (filePath === '') {
      return Promise.resolve(newrelicMetrics)
    }
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const objectToRead = JSON.parse(fileContent)
    if (Object.keys(objectToRead).length) {
      // eslint-disable-next-line github/array-foreach
      Object.keys(objectToRead).forEach(key => {
        newrelicMetrics[key] = objectToRead[key]
      })
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
  return Promise.resolve(newrelicMetrics)
}

run()
