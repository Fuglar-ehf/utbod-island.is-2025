import {
  Hash,
  PersistentVolumeClaim,
  ReplicaCount,
  Service,
} from './input-types'
import { UberChartType } from './charts'
import { FeatureNames } from '../features'

// Output types
export type ContainerRunHelm = {
  command: string[]
  args?: string[]
  name?: string
  resources: {
    limits: {
      cpu: string
      memory: string
    }
    requests: {
      cpu: string
      memory: string
    }
  }
}
export type OutputAccessModes = 'ReadWriteMany' | 'ReadOnlyMany'
export type OutputPersistentVolumeClaim = {
  name?: string
  size: string
  accessModes: OutputAccessModes
  mountPath: string
  /**
   * Sets the storageClass, leave empty if storageClass means little to you(defaults to efs-csi),
   * Mostly for internal use by the DevOps team.
   */
  storageClass: 'efs-csi'
}
export type ContainerEnvironmentVariables = { [name: string]: string }
export type ContainerSecrets = { [name: string]: string }

export interface ServiceHelm {
  replicaCount?: {
    min: number
    max: number
    default: number
  }

  hpa?: {
    scaling: {
      replicas: {
        min: number
        max: number
      }
      metric: { nginxRequestsIrate?: number; cpuAverageUtilization: number }
    }
  }

  healthCheck: {
    port?: number
    liveness: {
      path: string
      initialDelaySeconds: number
      timeoutSeconds: number
    }
    readiness: {
      path: string
      initialDelaySeconds: number
      timeoutSeconds: number
    }
  }

  serviceAccount?: {
    create: boolean
    name: string
    annotations: {
      'eks.amazonaws.com/role-arn': string
    }
  }

  service?: {
    targetPort: number
  }

  podSecurityContext?: {
    fsGroup: 65534
  }

  securityContext: {
    privileged?: boolean
    allowPrivilegeEscalation?: boolean
  }

  ingress?: {
    [name: string]: {
      annotations: {
        [anntName: string]: string
      }
      hosts: { host: string; paths: string[] }[]
    }
  }

  initContainer?: {
    secrets: ContainerSecrets
    env: ContainerEnvironmentVariables
    containers: ContainerRunHelm[]
  }

  command?: string[]
  args?: string[]
  resources?: {
    limits?: {
      cpu: string
      memory: string
    }
    requests: {
      cpu: string
      memory: string
    }
  }
  pvcs?: OutputPersistentVolumeClaim[]
  grantNamespaces: string[]
  grantNamespacesEnabled: boolean

  env: ContainerEnvironmentVariables
  secrets: ContainerSecrets
  enabled: boolean
  namespace: string
  image: {
    repository: string
  }
  extra?: Hash
  files?: string[]
}

export interface FeatureKubeJob {
  apiVersion: 'batch/v1'
  kind: 'Job'
  metadata: { name: string; labels?: { [name: string]: string } }
  spec: {
    template: {
      spec: {
        serviceAccountName: 'feature-deployment'
        containers: {
          command: string[]
          image: string
          name: string
          env: { name: string; value: string }[]
        }[]
        restartPolicy: 'Never' | 'OnFailure'
      }
    }
  }
}

export type SerializeSuccess = {
  type: 'success'
  serviceDef: ServiceHelm
}

export type SerializeErrors = {
  type: 'error'
  errors: string[]
}

export type SerializeMethod = (
  service: Service,
  uberChart: UberChartType,
  featuresOn?: FeatureNames[],
) => SerializeSuccess | SerializeErrors

export type Services = {
  [name: string]: ServiceHelm
}

export type ValueFile = {
  namespaces: string[]
  services: Services
}
