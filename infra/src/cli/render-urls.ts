import { OpsEnv } from '../dsl/types/input-types'
import { HelmService } from '../dsl/types/output-types'
import { Envs } from '../environments'
import {
  ChartName,
  ChartNames,
  Charts,
  Deployments,
} from '../uber-charts/all-charts'
import { renderHelmServices } from '../dsl/exports/helm'

const renderUrlsForService = ({ ingress = {} }: HelmService) => {
  const urls: string[] = []
  Object.keys(ingress).forEach((ingressName) => {
    ingress[ingressName].hosts.forEach((host) => {
      host.paths.forEach((path: string) => {
        urls.push(`https://${host.host}${path}`)
      })
    })
  })
  return urls
}

const renderUrlsForChart = async (
  environment: OpsEnv,
  chartName: ChartName,
) => {
  const services = (
    await renderHelmServices(
      Envs[Deployments[chartName][environment]],
      Charts[chartName][environment],
      Charts[chartName][environment],
    )
  ).services

  return Object.keys(services).reduce((acc, serviceName) => {
    const urls = renderUrlsForService(services[serviceName])
    if (urls.length <= 0) {
      return acc
    }
    return { ...acc, [serviceName]: urls }
  }, {})
}

export const renderUrls = async (environment: OpsEnv) => {
  console.log(
    await ChartNames.reduce(async (acc, chartName) => {
      return {
        ...(await acc),
        ...(await renderUrlsForChart(environment, chartName)),
      }
    }, Promise.resolve({})),
  )
}
