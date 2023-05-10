import {Button, NavigationBarSheet, TextField, Typography} from '@ui';
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Alert} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {useIntl} from 'react-intl';
import {testIDs} from '../../utils/test-ids';
import {navigateTo} from '../../lib/deep-linking';
import {useUserProfile} from './profile-queries';
import {client} from '../../graphql/client';
import {CREATE_SMS_VERIFICATION} from '../../graphql/queries/create-sms-verification.mutation';

const {
  getNavigationOptions,
  useNavigationOptions,
} = createNavigationOptionHooks(() => ({
  topBar: {
    visible: false,
  },
}));

const parsePhone = (phone: string) => {
  return phone
    .trim()
    .replace(/^\+354/, '')
    .replace(/-/g, '');
};

export const EditPhoneScreen: NavigationFunctionComponent<{
  phone?: string;
}> = ({componentId, phone}) => {
  useNavigationOptions(componentId);
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const userProfile = useUserProfile();
  const [text, onChangeText] = React.useState(phone ?? '');

  const originalPhone = parsePhone(
    userProfile.data?.getUserProfile?.mobilePhoneNumber ?? phone ?? '',
  );

  const updatePhone = (value: string) => {
    let str = parsePhone(value);
    if (str.length > 3) {
      str = str.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    }
    onChangeText(str);
  };

  useEffect(() => {
    if (userProfile.data?.getUserProfile?.mobilePhoneNumber) {
      updatePhone(userProfile.data?.getUserProfile?.mobilePhoneNumber);
    }
  }, [userProfile]);

  const disabled = parsePhone(text) === originalPhone || text.trim() === '';

  // todo data bind default state
  return (
    <View style={{flex: 1}} testID={testIDs.SCREEN_EDIT_PHONE}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({id: 'edit.phone.screenTitle'})}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{marginHorizontal: 16}}
      />
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
        <View style={{paddingHorizontal: 16}}>
          <View style={{marginBottom: 32, marginTop: 8}}>
            <Typography>
              {intl.formatMessage({id: 'edit.phone.description'})}
            </Typography>
          </View>
          <View style={{marginBottom: 24}}>
            <TextField
              label={intl.formatMessage({id: 'edit.phone.inputlabel'})}
              value={text}
              onChange={updatePhone}
              maxLength={8}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />
          </View>
          <Button
            title={intl.formatMessage({id: 'edit.phone.button'})}
            onPress={async () => {
              setLoading(true);
              try {
                const res = await client.mutate({
                  mutation: CREATE_SMS_VERIFICATION,
                  variables: {
                    input: {
                      mobilePhoneNumber: text.replace(/-/g, ''),
                    },
                  },
                });
                if (res.data) {
                  navigateTo('/editconfirm/phone', {
                    type: 'phone',
                    phone: `+354-${text.replace(/-/g, '')}`,
                    parentComponentId: componentId,
                  });
                } else {
                  throw new Error('Failed to create sms verification');
                }
              } catch (e) {
                Alert.alert('Villa', 'Gat ekki sent staðfestingarkóða');
              }
              setLoading(false);
            }}
            disabled={disabled || loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

EditPhoneScreen.options = getNavigationOptions;
