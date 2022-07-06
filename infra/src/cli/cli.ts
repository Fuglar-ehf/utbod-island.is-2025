import yargs from 'yargs/yargs'
import { renderEnv } from './render-env'
import { renderUrls } from './render-urls'
import { renderSecrets, renderSecretsCommand } from './render-secrets'
import { ChartName, ChartNames, OpsEnvNames } from '../uber-charts/all-charts'
import { OpsEnv } from '../dsl/types/input-types'
import { OpsEnvName } from '../dsl/types/charts'

yargs(process.argv.slice(2))
  .command(
    'render-env',
    'Render a chart for environment',
    (yargs) => {
      return yargs
        .option('env', { choices: OpsEnvNames, demandOption: true })
        .option('chart', { choices: ChartNames, demandOption: true })
    },
    (argv) => {
      process.stdout.write(
        renderEnv(argv.env as OpsEnv, argv.chart as ChartName),
      )
    },
  )
  .command(
    'render-urls',
    'Render urls from ingress for environment',
    (yargs) => {
      return yargs.option('env', { choices: OpsEnvNames, demandOption: true })
    },
    (argv) => {
      renderUrls(argv.env as OpsEnv)
    },
  )
  .command(
    'render-secrets',
    'Render secrets secrets needed by service',
    (yargs) => {
      return yargs.option('service', { demandOption: true })
    },
    async (argv) => {
      await renderSecretsCommand(argv.service as string)
    },
  )
  .demandCommand(1)
  .parse()
