import {Button, dynamicColor, font, Illustration} from '@ui';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import styled from 'styled-components/native';
import logo from '../../assets/logo/logo-64w.png';
import testinglogo from '../../assets/logo/testing-logo-64w.png';
import {FormattedMessage, useIntl} from 'react-intl';
import {openBrowser} from '../../lib/rn-island';
import {useAuthStore} from '../../stores/auth-store';
import {preferencesStore} from '../../stores/preferences-store';
import {nextOnboardingStep} from '../../utils/onboarding';
import {testIDs} from '../../utils/test-ids';
import {config, environments} from '../../config';
import {showPicker} from '../../lib/show-picker';
import {
  environmentStore,
  useEnvironmentStore,
} from '../../stores/environment-store';

const Host = styled.View`
  flex: 1;
  background-color: ${dynamicColor('background')};
`;

const Title = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 26,
    color: props => ({light: props.theme.color.dark400, dark: 'white'}),
  })}
  text-align: center;
  margin-top: 32px;
`;

const BottomRow = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  padding: 32px;
`;

const LightButtonText = styled.Text`
  ${font({
    fontWeight: '600',
    color: props => props.theme.color.blue400,
  })}
`;

function getChromeVersion(): Promise<number> {
  return new Promise(resolve => {
    NativeModules.IslandModule.getAppVersion(
      'com.android.chrome',
      (version: string) => {
        if (version) {
          resolve(Number(version?.split('.')?.[0] || 0));
        } else {
          resolve(0);
        }
      },
    );
  });
}

const isTestingApp = true;

export const LoginScreen: NavigationFunctionComponent = ({componentId}) => {
  const authStore = useAuthStore();
  const {environment = environments.prod, cognito} = useEnvironmentStore();
  const intl = useIntl();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authState, setAuthState] = useState<{
    nonce: string;
    codeChallenge: string;
    state: string;
  } | null>(null);

  useEffect(() => {
    try {
      const eventEmitter = new NativeEventEmitter(NativeModules.RNAppAuth);
      const onAuthRequestInitiated = (event: any) => setAuthState(event);
      const subscription = eventEmitter.addListener(
        'onAuthRequestInitiated',
        onAuthRequestInitiated,
      );
      return () => {
        subscription.remove();
      };
    } catch (err) {
      // noop
    }
  }, []);

  const onLoginPress = async () => {
    if (Platform.OS === 'android') {
      const chromeVersion = await getChromeVersion();
      if (chromeVersion < 55) {
        // Show dialog on how to update.
        Alert.alert(
          intl.formatMessage({id: 'login.outdatedBrowserTitle'}),
          intl.formatMessage({id: 'login.outdatedBrowserMessage'}),
          [
            {
              text: intl.formatMessage({
                id: 'login.outdatedBrowserUpdateButton',
              }),
              style: 'default',
              onPress() {
                Linking.openURL('market://details?id=com.android.chrome');
              },
            },
            {
              style: 'cancel',
              text: intl.formatMessage({
                id: 'login.outdatedBrowserCancelButton',
              }),
            },
          ],
        );
        return;
      }
    }

    if (isLoggingIn) {
      return;
    }

    setIsLoggingIn(true);
    try {
      const isAuth = await authStore.login();
      if (isAuth) {
        const userInfo = await authStore.fetchUserInfo();
        if (userInfo) {
          await nextOnboardingStep();
        }
      }
    } catch (err) {
      if ((err as Error).message.indexOf('Connection error') >= 0) {
        Alert.alert(
          intl.formatMessage({id: 'login.networkErrorTitle'}),
          intl.formatMessage({id: 'login.networkErrorMessage'}),
        );
      } else {
        console.warn(err);
      }
    }
    setIsLoggingIn(false);
  };

  const onCognitoLoginPress = () => {
    const params = {
      approval_prompt: 'prompt',
      client_id: config.cognitoClientId,
      redirect_uri: `${config.bundleId}://cognito`,
      response_type: 'token',
      scope: 'openid',
      state: 'state',
    };
    const url = `${config.cognitoUrl}?${new URLSearchParams(params)}`;
    return openBrowser(url, componentId);
  };

  const onEnvironmentPress = () => {
    environmentStore
      .getState()
      .actions.loadEnvironments()
      .then(res => {
        console.log(environment);
        showPicker({
          type: 'radio',
          title: 'Select environment',
          items: res,
          selectedId: environmentStore.getState().environment?.id,
          cancel: true,
        })
          .then(({selectedItem}: any) => {
            environmentStore.getState().actions.setEnvironment(selectedItem.id);
          })
          .catch(err => {
            // noop
          });
        console.log(res);
      });

    // const items = Object.values(environments);
  };

  const onLanguagePress = () => {
    const {locale, setLocale} = preferencesStore.getState();
    setLocale(locale === 'en-US' ? 'is-IS' : 'en-US');
  };

  const onNeedHelpPress = () => {
    const helpDeskUrl = 'https://island.is/flokkur/thjonusta-island-is';
    openBrowser(helpDeskUrl, componentId);
  };

  return (
    <Host testID={testIDs.SCREEN_LOGIN}>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 32,
            zIndex: 3,
          }}
        >
          <Image
            source={isTestingApp ? testinglogo : logo}
            resizeMode="contain"
            style={{width: 48, height: 48}}
          />
          <View style={{maxWidth: 300, minHeight: 170}}>
            {isTestingApp ? (
              <>
                <Title>{environment?.label ?? 'N/A'}</Title>
                <Text
                  style={{marginTop: 8, textAlign: 'center', lineHeight: 22}}
                >
                  {config.bundleId}
                  {'\n'}
                  {environment?.idsIssuer ?? 'N/A'}
                  {'\n'}
                  {environment?.apiUrl ?? 'N/A'}
                  {'\n'}
                  Cognito: {cognito ? '✓' : '✕'}
                  {'\n'}
                </Text>
              </>
            ) : (
              <Title>
                <FormattedMessage id="login.welcomeMessage" />
              </Title>
            )}
          </View>
          <View style={{position: 'absolute', opacity: 0, top: 0, left: 0}}>
            <Text testID="auth_nonce">{authState?.nonce ?? 'noop1'}</Text>
            <Text testID="auth_code">
              {authState?.codeChallenge ?? 'noop2'}
            </Text>
            <Text testID="auth_state">{authState?.state ?? 'noop3'}</Text>
          </View>
          {isTestingApp ? (
            <>
              <Button
                isTransparent
                title="Cognito Login"
                onPress={onCognitoLoginPress}
                style={{
                  width: 213,
                  marginBottom: 16,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              />
              <Button
                title="IDS Login"
                disabled={!(environment.id === 'production' || !!cognito)}
                onPress={onLoginPress}
                style={{width: 213}}
              />
            </>
          ) : (
            <Button
              title={intl.formatMessage({id: 'login.loginButtonText'})}
              testID={testIDs.LOGIN_BUTTON_AUTHENTICATE}
              onPress={onLoginPress}
              style={{width: 213}}
            />
          )}
        </View>
        <BottomRow>
          <TouchableOpacity onPress={onLanguagePress}>
            <LightButtonText>
              <FormattedMessage id="login.languageButtonText" />
            </LightButtonText>
          </TouchableOpacity>
          {isTestingApp ? (
            <TouchableOpacity onPress={onEnvironmentPress}>
              <LightButtonText>Change Environment</LightButtonText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onNeedHelpPress}>
              <LightButtonText>
                <FormattedMessage id="login.needHelpButtonText" />
              </LightButtonText>
            </TouchableOpacity>
          )}
        </BottomRow>
      </SafeAreaView>
      <Illustration isBottomAligned />
    </Host>
  );
};

LoginScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
  layout: {
    orientation: ['portrait'],
  },
};
