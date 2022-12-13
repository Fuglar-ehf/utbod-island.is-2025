import { ref, service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { EnvironmentConfig } from './types/charts'
import { getFeatureAffectedServices } from './feature-deployments'
import { HelmValueFile } from './types/output-types'
import { getHelmValueFile } from './value-files-generators/helm-value-file'
import { renderers } from './upstream-dependencies'
import { generateOutput } from './processing/rendering-pipeline'

const Dev: EnvironmentConfig = {
  auroraHost: 'a',
  domain: 'staging01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  feature: 'feature-A',
  global: {},
}

describe('Feature-deployment support', () => {
  let values: HelmValueFile

  beforeEach(async () => {
    const dependencyA = service('service-a').namespace('A')
    const dependencyB = service('service-b')
    const dependencyC = service('service-c')
    const apiService = service('graphql')
      .env({
        A: ref((h) => `${h.svc(dependencyA)}`),
        B: ref(
          (h) =>
            `${h.featureDeploymentName ? 'feature-' : ''}${h.svc(dependencyB)}`,
        ),
      })
      .initContainer({
        containers: [
          {
            command: 'node',
          },
        ],
        postgres: {},
      })
      .ingress({
        primary: {
          host: { dev: 'a', staging: 'a', prod: 'a' },
          paths: ['/'],
        },
      })
      .postgres()

    const services1 = await getFeatureAffectedServices(
      [apiService, dependencyA, dependencyB],
      [dependencyA, dependencyC],
      [dependencyC],
      Dev,
    )
    const chart1 = new Kubernetes(Dev)
    const services = await generateOutput({
      runtime: chart1,
      services: services1,
      outputFormat: renderers.helm,
      env: Dev,
    })
    values = getHelmValueFile(chart1, services, 'no-mocks', Dev)
  })

  it('dynamic service name generation', () => {
    expect(values.services.graphql.env).toEqual({
      A: 'web-service-a',
      B: 'feature-web-service-b.islandis.svc.cluster.local',
      DB_USER: 'feature_feature_A_graphql',
      DB_NAME: 'feature_feature_A_graphql',
      DB_HOST: 'a',
      DB_REPLICAS_HOST: 'a',
      NODE_OPTIONS: '--max-old-space-size=208',
      SERVERSIDE_FEATURES_ON: '',
    })
  })

  it('dynamic secrets path', () => {
    expect(values.services.graphql.secrets).toHaveProperty('DB_PASS')
    expect(values.services.graphql.secrets!.DB_PASS).toEqual(
      '/k8s/feature-feature-A-graphql/DB_PASSWORD',
    )
  })

  it('dynamic secrets path', () => {
    expect(values.services.graphql.initContainer?.secrets).toHaveProperty(
      'DB_PASS',
    )
    expect(values.services.graphql.initContainer?.secrets!.DB_PASS).toEqual(
      '/k8s/feature-feature-A-graphql/DB_PASSWORD',
    )
  })

  it('feature deployment namespaces', () => {
    expect(Object.keys(values.services).sort()).toEqual([
      'graphql',
      'service-a',
    ])
    expect(values.services['graphql'].namespace).toEqual(
      `feature-${Dev.feature}`,
    )
    expect(values.services['service-a'].namespace).toEqual(
      `feature-${Dev.feature}`,
    )
  })

  it('feature deployment ingress', () => {
    expect(values.services.graphql.ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
        },
        hosts: [
          {
            host: 'feature-A-a.staging01.devland.is',
            paths: ['/'],
          },
        ],
      },
    })
  })
})
