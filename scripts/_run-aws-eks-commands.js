#!/usr/bin/env node

const yargs = require('yargs')
const { execSync } = require('child_process')
const { defaultProvider } = require('@aws-sdk/credential-provider-node')

const getCredentials = async (profile) => {
  return defaultProvider({ profile })().catch((err) => {
    if (err.name === 'CredentialsProviderError') {
      console.error(
        'Could not load AWS credentials from any providers. Did you forget to configure environment variables, aws profile or run `aws sso login`?',
      )
    } else {
      console.error(err)
    }
    process.exit(1)
  })
}

const argv = yargs(process.argv.slice(2))

const error = (errorMessage) => {
  console.error(errorMessage)
  process.exit(1)
}

function buildDockerImage(dockerImage, target) {
  console.log(
    `Preparing docker image for restarting deployments - \uD83D\uDE48`,
  )
  execSync(
    `docker build -f ${__dirname}/Dockerfile.proxy --target ${target} -t ${dockerImage} ${__dirname}`,
  )
}

const args = argv
  .command(
    'proxy',
    'Run proxy',
    (yargs) =>
      yargs
        .option('port', {
          description:
            'Port number on which the Kubernetes service is listening on',
          default: 80,
        })
        .option('proxy-port', {
          description: 'Port number the local proxy is listening on',
          default: 8080,
        })
        .option('cluster', {
          description: 'Name of Kubernetes cluster',
          default: 'dev-cluster01',
        })
        .demandOption(
          'namespace',
          'Name of the Kubernetes namespace the service is part of',
        )
        .option('profile', {
          description: 'AWS profile to use',
        })
        .demandOption('service', 'Name of the Kubernetes service'),
    async (args) => {
      const credentials = await getCredentials(args.profile)
      const dockerBuild = `proxy-${args.service}`
      buildDockerImage(dockerBuild, 'proxy')
      console.log(`Now running the proxy - \uD83D\uDE31`)
      console.log(
        `Proxy will be listening on http://localhost:${args['proxy-port']} - \uD83D\uDC42`,
      )
      execSync(
        `docker run --rm -e AWS_ACCESS_KEY_ID=${credentials.accessKeyId} -e AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey} -e AWS_SESSION_TOKEN=${credentials.sessionToken} -e CLUSTER=${args.cluster} -e TARGET_SVC=${args.service} -e TARGET_NAMESPACE=${args.namespace} -e TARGET_PORT=${args.port} -p ${args['proxy-port']}:8080 ${args.service}`,
        { stdio: 'inherit' },
      )
    },
  )
  .command(
    'restart-service',
    'Restart service (rolling update on the deployment)',
    (yargs) =>
      yargs
        .option('cluster', {
          description: 'Name of Kubernetes cluster',
          default: 'dev-cluster01',
        })
        .option('profile', {
          description: 'AWS profile to use',
        })
        .demandOption(
          'namespace',
          'Name of the Kubernetes namespace the service is part of',
        )
        .demandOption('service', 'Name of the Kubernetes service'),
    async (args) => {
      const credentials = await getCredentials(args.profile)
      let dockerImage = `restart-${args.service}`
      buildDockerImage(dockerImage, `restart-deployment`)
      console.log(`Now running the restart - \uD83D\uDE31`)
      execSync(
        `docker run --rm -e AWS_ACCESS_KEY_ID=${credentials.accessKeyId} -e AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey} -e AWS_SESSION_TOKEN=${credentials.sessionToken} -e CLUSTER=${args.cluster} -e TARGET_SVC=${args.service} -e TARGET_NAMESPACE=${args.namespace} ${dockerImage}`,
        { stdio: 'inherit' },
      )
    },
  )
  .onFinishCommand((_) => console.log(`done`))
  .showHelpOnFail(true)
  .demandCommand().argv
