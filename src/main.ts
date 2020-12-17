import * as core from '@actions/core'
import fs from 'fs'
import {generateReport} from './report'

async function run(): Promise<void> {
  try {
    const inputFile: string = core.getInput('input_file')
    const outputFile: string = core.getInput('output_file')
    const queryKey: string = core.getInput('nr_query_id')
    const accountId: string = core.getInput('nr_account_id')
    const os: string = core.getInput('measured_os')

    const mdReport = await generateReport(inputFile, accountId, queryKey, os)

    fs.writeFileSync(outputFile, mdReport)
    core.setOutput('data', mdReport)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
