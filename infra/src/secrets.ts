import AWS from 'aws-sdk'
import yargs from 'yargs'
import { OpsEnv } from './dsl/types/input-types'
import { charts, OpsEnvNames } from './uber-charts/all-charts'
const { hideBin } = require('yargs/helpers')

interface GetArguments {
  key: string
}

interface StoreArguments extends GetArguments {
  secret: string
}

interface DeleteArguments {
  prefix: string
}

const config = {
  region: 'eu-west-1',
}

const ssm = new AWS.SSM(config)
yargs(hideBin(process.argv))
  .command(
    'get-all-required-secrets',
    'get all required secrets from all charts',
    { env: { type: 'string', demand: true, choices: OpsEnvNames } },
    (p) => {
      console.log(
        Object.values(charts)
          .map((chart) => chart[p.env as OpsEnv])
          .flatMap((s) => s)
          .flatMap((s) => Object.values(s.serviceDef.secrets))
          .join('\n'),
      )
    },
  )
  .command(
    'get <key>',
    'get secret',
    () => {},
    async ({ key }: GetArguments) => {
      const parameterInput = {
        Name: key,
        WithDecryption: true,
      }

      const { Parameter } = await ssm.getParameter(parameterInput).promise()
      if (Parameter) {
        return console.log(Parameter.Value)
      }
    },
  )
  .command(
    'store <key> <secret>',
    'store secret',
    () => {},
    async ({ key, secret }: StoreArguments) => {
      await ssm
        .putParameter({
          Name: key,
          Value: secret,
          Type: 'SecureString',
        })
        .promise()
      console.log('Done!')
    },
  )

  .command(
    'delete <prefix>',
    'delete secrets by prefix',
    () => {},
    async ({ prefix }: DeleteArguments) => {
      const { Parameters } = await ssm
        .describeParameters({
          ParameterFilters: [
            { Key: 'Name', Option: 'BeginsWith', Values: [prefix] },
          ],
        })
        .promise()
      if (Parameters && Parameters.length > 0) {
        console.log(
          `Parameters to destroy: ${Parameters.map(({ Name }) => Name)}`,
        )
        await Promise.all(
          Parameters.map(({ Name }) =>
            Name
              ? ssm.deleteParameter({ Name }).promise()
              : new Promise((resolve) => resolve()),
          ),
        )
      }
    },
  )
  .demandCommand().argv
