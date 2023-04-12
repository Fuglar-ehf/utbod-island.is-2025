export type TestEnvironment = 'local' | 'dev' | 'staging' | 'prod'

export enum BaseAuthority {
  dev = 'beta.dev01.devland.is',
  staging = 'beta.staging01.devland.is',
  ads = 'loftbru.dev01.devland.is',
  judicialSystem = 'judicial-system.dev01.devland.is',
  prod = 'island.is',
  local = 'localhost',
}

export enum AuthUrl {
  dev = 'https://identity-server.dev01.devland.is',
  staging = 'https://identity-server.staging01.devland.is',
  prod = 'https://innskra.island.is',
  local = dev,
}

export const JUDICIAL_SYSTEM_HOME_URL = '/api/auth/login?nationalId=9999999999'

export const getEnvironmentBaseUrl = (authority: string) => {
  const baseurlPrefix = process.env.BASE_URL_PREFIX ?? ''
  const prefix =
    (baseurlPrefix?.length ?? 0) > 0 && baseurlPrefix !== 'main'
      ? `${baseurlPrefix}-`
      : ''
  return `https://${prefix}${authority}`
}
const localUrl = `http://${BaseAuthority.local}:${process.env.PORT ?? 4200}`
const envs: {
  [envName in TestEnvironment]: {
    authUrl: string
    islandisBaseUrl: string
    adsBaseUrl: string
    judicialSystemBaseUrl: string
  }
} = {
  dev: {
    authUrl: AuthUrl.dev,
    islandisBaseUrl: getEnvironmentBaseUrl(BaseAuthority.dev),
    adsBaseUrl: getEnvironmentBaseUrl(BaseAuthority.ads),
    judicialSystemBaseUrl: getEnvironmentBaseUrl(BaseAuthority.judicialSystem),
  },
  staging: {
    authUrl: AuthUrl.staging,
    islandisBaseUrl: getEnvironmentBaseUrl(BaseAuthority.staging),
    adsBaseUrl: getEnvironmentBaseUrl('loftbru.staging01.devland.is'),
    judicialSystemBaseUrl: getEnvironmentBaseUrl(
      'judicial-system.staging01.devland.is',
    ),
  },
  prod: {
    authUrl: AuthUrl.prod,
    islandisBaseUrl: getEnvironmentBaseUrl(BaseAuthority.prod),
    adsBaseUrl: getEnvironmentBaseUrl('loftbru.island.is'),
    judicialSystemBaseUrl: getEnvironmentBaseUrl(BaseAuthority.prod),
  },
  local: {
    authUrl: AuthUrl.local,
    islandisBaseUrl: localUrl,
    adsBaseUrl: localUrl,
    judicialSystemBaseUrl: localUrl,
  },
}

export const env = (process.env.TEST_ENVIRONMENT ?? 'local') as TestEnvironment
const hotEnv = process.env.TEST_URL
  ? { islandisBaseUrl: process.env.TEST_URL }
  : {}
export const urls = { ...envs[env], ...hotEnv }
