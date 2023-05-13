import {Platform} from 'react-native';
// import env from 'react-native-ultimate-config'
// import { Constants } from 'react-native-unimodules'

const env: Record<string, string> = {};
const Constants = {WebManifest: {}};

export interface Config {
  identityServer: {
    issuer: string;
    clientId: string;
    scopes: string[];
  };
  apiEndpoint: string;
  bundleId: string;
  datadogClientToken: string;
  sentryDsn: string;
  configCat: string;
  constants: any;
  env: typeof env;
}

const {WebManifest, ...ConstantsRest} = Constants;

const defaults = {
  identityServer: {
    issuer: 'https://innskra.island.is',
    scopes: [
      'openid',
      'profile',
      'offline_access',
      '@island.is/applications:read',
      '@island.is/documents',
      '@island.is/user-profile:read',
      '@island.is/internal',
      '@island.is/me:details',
    ],
    clientId: '@island.is/app',
  },
  apiEndpoint: 'https://island.is/api',
};

export const config: Config = {
  identityServer: {
    clientId: env.IDENTITYSERVER_CLIENT_ID || '@island.is-app',
    issuer: env.IDENTITYSERVER_ISSUER || defaults.identityServer.issuer,
    scopes:
      env.IDENTITYSERVER_SCOPES?.split(' ') || defaults.identityServer.scopes,
  },
  apiEndpoint: env.API_ENDPOINT || defaults.apiEndpoint,
  bundleId:
    Platform.select({
      ios: env.BUNDLE_ID_IOS,
      android: env.BUNDLE_ID_ANDROID,
    }) || 'is.island.app',
  datadogClientToken: env.DATADOG_CLIENT_TOKEN,
  sentryDsn: env.SENTRY_DSN,
  configCat: env.CONFIGCAT_CLIENT_TOKEN,
  constants: ConstantsRest,
  env,
};

if (__DEV__) {
  console.log(config);
}
