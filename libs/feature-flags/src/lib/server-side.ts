import { ServerSideFeatureClientType } from './types'
import { ServerSideFeature } from './features'

export class ServerSideFeatures implements ServerSideFeatureClientType {
  input?: string
  processed = false
  featuresOn: ServerSideFeature[] = []
  constructor(featuresOn?: string) {
    this.input = featuresOn
  }
  isOn(feature: ServerSideFeature): boolean {
    if (!this.processed) {
      if (typeof this.input === 'undefined') {
        throw new Error('Server-side feature flags input is missing or corrupt')
      } else {
        this.featuresOn = this.input
          .split(',')
          .map((item) => item.trim() as ServerSideFeature)
        this.processed = true
      }
    }
    return this.featuresOn.includes(feature)
  }
}

export class ServerSideFeaturesOnTheClientSide
  implements ServerSideFeatureClientType {
  isOn(feature: ServerSideFeature): boolean {
    throw new Error(
      'Using server-side features in the browser is not supported',
    )
  }
}
