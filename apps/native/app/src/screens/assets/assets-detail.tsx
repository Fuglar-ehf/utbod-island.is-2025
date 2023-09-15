import React from 'react';
import {useIntl} from 'react-intl';
import {ScrollView, View} from 'react-native';
import {testIDs} from '../../utils/test-ids';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Divider, Input, InputRow, NavigationBarSheet} from '@ui';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {useQuery} from '@apollo/client';
import {client} from '../../graphql/client';
import {GET_SINGLE_PROPERTY_QUERY} from '../../graphql/queries/get-single-property-query';

const {getNavigationOptions, useNavigationOptions} =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }));

export const AssetsDetailScreen: NavigationFunctionComponent<{item: any}> = ({
  componentId,
  item,
}) => {
  useNavigationOptions(componentId);

  const {data, loading, error} = useQuery(GET_SINGLE_PROPERTY_QUERY, {
    client,
    fetchPolicy: 'cache-first',
    variables: {
      input: {
        assetId: item?.propertyNumber,
      },
    },
  });

  const intl = useIntl();
  const isError = !!error;
  const isLoading = loading;

  const appraisal = data?.assetsDetail?.appraisal;
  const unitsOfUse = data?.assetsDetail?.unitsOfUse;

  return (
    <View style={{flex: 1}} testID={testIDs.SCREEN_VEHICLE_DETAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={item?.defaultAddress?.displayShort}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{marginHorizontal: 16}}
      />
      <ScrollView style={{flex: 1}}>
        <View>
          <InputRow>
            <Input
              loading={isLoading}
              error={isError}
              label={intl.formatMessage({id: 'assetsDetail.propertyNumber'})}
              value={item?.propertyNumber}
              size="big"
              noBorder
              isCompact
            />
          </InputRow>
          <InputRow>
            <Input
              loading={isLoading}
              error={isError}
              label={intl.formatMessage(
                {id: 'assetsDetail.activeAppraisal'},
                {activeYear: appraisal?.activeYear},
              )}
              value={`${intl.formatNumber(appraisal?.activeAppraisal)} kr.`}
              size="big"
              noBorder
              isCompact
            />
            <Input
              loading={isLoading}
              error={isError}
              label={intl.formatMessage(
                {id: 'assetsDetail.plannedAppraisal'},
                {plannedYear: appraisal?.plannedYear},
              )}
              value={`${intl.formatNumber(appraisal?.plannedAppraisal)} kr.`}
              size="big"
              noBorder
              isCompact
            />
          </InputRow>

          <Divider spacing={2} style={{marginHorizontal: 16}} />

          {unitsOfUse?.unitsOfUse.map((unit: any, index: number) => {
            return (
              <View key={`${unit?.propertyNumber}-${index}`}>
                <InputRow>
                  <Input
                    loading={isLoading}
                    error={isError}
                    label={intl.formatMessage({id: 'assetsDetail.explanation'})}
                    value={unit?.explanation}
                    noBorder
                    isCompact
                  />
                  <Input
                    loading={isLoading}
                    error={isError}
                    label={intl.formatMessage({id: 'assetsDetail.displaySize'})}
                    value={`${unit?.displaySize} m²`}
                    noBorder
                    isCompact
                  />
                </InputRow>

                <InputRow>
                  <Input
                    loading={isLoading}
                    error={isError}
                    label={intl.formatMessage({
                      id: 'assetsDetail.municipality',
                    })}
                    value={unit?.address?.municipality}
                    noBorder
                    isCompact
                  />
                  <Input
                    loading={isLoading}
                    error={isError}
                    label={intl.formatMessage({id: 'assetsDetail.postNumber'})}
                    value={unit?.address?.postNumber}
                    noBorder
                    isCompact
                  />
                </InputRow>

                <InputRow>
                  {unit?.buildYearDisplay ? (
                    <Input
                      loading={isLoading}
                      error={isError}
                      label={intl.formatMessage({
                        id: 'assetsDetail.buildYearDisplay',
                      })}
                      value={unit?.buildYearDisplay}
                      noBorder
                      isCompact
                    />
                  ) : null}
                  <Input
                    loading={isLoading}
                    error={isError}
                    label={intl.formatMessage({id: 'assetsDetail.marking'})}
                    value={unit?.marking}
                    noBorder
                    isCompact
                  />
                </InputRow>
                {index + 1 < unitsOfUse?.unitsOfUse.length && (
                  <Divider spacing={2} style={{marginHorizontal: 16}} />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

AssetsDetailScreen.options = getNavigationOptions;
