import { useQuery } from "@apollo/client";
import { Input, InputRow, NavigationBarSheet, Typography } from '@ui';
import React from 'react';
import { useIntl } from 'react-intl';
import { SafeAreaView, ScrollView, View } from "react-native";
import { Navigation, NavigationFunctionComponent } from "react-native-navigation";
import { client } from '../../graphql/client';
import { FAMILY_QUERY } from '../../graphql/queries/list-family-query';
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options';
import { testIDs } from '../../utils/test-ids';
import { formatNationalId } from '../profile/tab-personal-info';

const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const FamilyDetailScreen: NavigationFunctionComponent<{ id: string, type: string }> = ({ componentId, id, type }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()

  const { data, loading, error } = useQuery(FAMILY_QUERY, { client, fetchPolicy: 'cache-first' })
  const { nationalRegistryUser, nationalRegistryChildren = [] } = data || {}

  const listOfPeople = [
    {...(nationalRegistryUser?.spouse ?? {}), type: 'spouse'},
    ...(nationalRegistryChildren ?? []).map((item: any) => ({...item, type: 'child'}))
  ].filter((item) => item.nationalId);

  const person = listOfPeople?.find((x) => x.nationalId === id) || null;

  if (!person) return null;

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_VEHICLE_DETAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'familyDetail.title' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} >
        <SafeAreaView>
          <View style={{ paddingBottom: 8, paddingTop: 16, paddingHorizontal: 16 }}>
            <Typography>{intl.formatMessage({ id: 'familyDetail.description' })}</Typography>
          </View>
          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.displayName' })}
              value={person?.name || person?.displayName}
              loading={loading}
              error={!!error}
              size="big"
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.familyRelation' })}
              value={intl.formatMessage({ id: 'familyDetail.natreg.familyRelationValue'}, {type})}
              loading={loading}
              error={!!error}
            />
          </InputRow>
          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.nationalId' })}
              value={formatNationalId(person?.nationalId)}
              loading={loading}
              error={!!error}
            />
            {person?.nationality ? (
              <Input
                label={intl.formatMessage({ id: 'familyDetail.natreg.citizenship' })}
                value={person?.nationality}
                loading={loading}
                error={!!error}
              />) : null
            }
          </InputRow>
          {person?.legalResidence ? (
            <InputRow>
              <Input
                label={intl.formatMessage({ id: 'familyDetail.natreg.legalResidence' })}
                value={person?.legalResidence}
                loading={loading}
                error={!!error}
              />
            </InputRow> ) : null
          }

          <InputRow>
          {person?.genderDisplay ?
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.gender' })}
              value={person?.genderDisplay}
              loading={loading}
              error={!!error}
            /> : null
          }
          {person?.birthplace ?
            <Input
              label={intl.formatMessage({ id: 'familyDetail.natreg.birthPlace' })}
              value={person?.birthplace}
              loading={loading}
              error={!!error}
            /> : null
          }
          </InputRow>

        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

FamilyDetailScreen.options = getNavigationOptions
