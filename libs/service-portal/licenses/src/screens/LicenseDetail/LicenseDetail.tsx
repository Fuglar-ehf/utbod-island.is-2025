import React from 'react'
import { useUserProfile } from '@island.is/service-portal/graphql'

import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Stack,
  Text,
  AlertBanner,
  Button,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import ExpandableLine from './ExpandableLine'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { GenericLicenseDataField, Query } from '@island.is/api/schema'
import { PkPass } from '../../components/QRCodeModal/PkPass'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import {
  getLicenseDetailHeading,
  getTypeFromPath,
} from '../../utils/dataMapper'

const dataFragment = gql`
  fragment genericLicenseDataFieldFragment on GenericLicenseDataField {
    type
    name
    label
    value
    fields {
      type
      name
      label
      value
      fields {
        type
        name
        label
        value
      }
    }
  }
`
const GenericLicenseQuery = gql`
  query GenericLicenseDetailQuery(
    $input: GetGenericLicenseInput!
    $locale: String
  ) {
    genericLicense(input: $input, locale: $locale) {
      nationalId
      license {
        type
        provider {
          id
        }
        pkpass
        timeout
        status
      }
      fetch {
        status
        updated
      }
      payload {
        data {
          ...genericLicenseDataFieldFragment
        }
        rawData
        metadata {
          licenseNumber
          links {
            label
            value
          }
        }
      }
    }
  }
  ${dataFragment}
`

const DataFields = ({
  fields,
  licenseType,
  pkPass,
}: {
  fields: GenericLicenseDataField[]
  licenseType?: string
  pkPass?: boolean
}) => {
  if (!fields || fields.length === 0) {
    return null
  }

  const isJSONDate = (str: string) =>
    str && !!str.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)

  return (
    <>
      {fields.map((field, i) => {
        return (
          <React.Fragment key={i}>
            {field.type === 'Value' && (
              <>
                {}
                <UserInfoLine
                  title={field.name ?? ''}
                  label={field.label ?? ''}
                  content={String(field.value ?? '')
                    .split(' ')
                    .map((part) =>
                      isJSONDate(part)
                        ? format(+new Date(part).getTime(), dateFormat.is)
                        : part,
                    )
                    .join(' ')}
                  paddingY={3}
                  labelColumnSpan={['1/1', '6/12']}
                  valueColumnSpan={['1/1', '6/12']}
                />
                <Divider />
              </>
            )}
            {field.type === 'Category' && (
              <ExpandableLine
                title={field.name + ' ' + field.label ?? ''}
                data={field.fields ?? []}
                type={licenseType}
              />
            )}
            {field.type === 'Group' && (
              <>
                <Text
                  variant="eyebrow"
                  color="purple400"
                  paddingBottom={2}
                  paddingTop={7}
                >
                  {field.label}
                </Text>

                <DataFields
                  fields={field.fields ?? []}
                  licenseType={licenseType}
                />
              </>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

const LicenseDetail: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile()
  const locale = userProfile?.locale ?? 'is'
  const {
    type,
  }: { type: string | undefined; provider: string | undefined } = useParams()
  const licenseType = type ? getTypeFromPath(type) : undefined
  const { data, loading: queryLoading, error } = useQuery<Query>(
    GenericLicenseQuery,
    {
      variables: {
        locale,
        input: {
          licenseType: licenseType,
        },
      },
    },
  )

  const { genericLicense = null } = data ?? {}

  const heading = getLicenseDetailHeading(licenseType ?? '')

  if (error && !queryLoading) {
    return (
      <Box>
        <AlertBanner
          description={formatMessage(m.errorFetchingDrivingLicense)}
          variant="error"
        />
      </Box>
    )
  }

  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={1}>
              <Text variant="h3" as="h1" paddingTop={0}>
                {formatMessage(heading.title)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage(heading.text)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      {queryLoading && <LicenseLoader />}

      {!error && !queryLoading && (
        <>
          {genericLicense?.payload?.metadata.links && (
            <Box
              display="flex"
              flexDirection={['column', 'row']}
              alignItems={['flexStart', 'center']}
              marginBottom={2}
            >
              {genericLicense?.license.pkpass && licenseType && (
                <>
                  <PkPass licenseType={licenseType} />
                  <Box marginX={[0, 1]} marginY={[1, 0]} />
                </>
              )}
              {genericLicense?.payload?.metadata.links.map((link, index) => {
                return (
                  <a
                    href={link.value}
                    target="_blank"
                    rel="noreferrer"
                    key={licenseType + '_link_' + index}
                  >
                    <Button
                      variant="utility"
                      size="small"
                      icon="open"
                      iconType="outline"
                    >
                      {link.label}
                    </Button>
                  </a>
                )
              })}
            </Box>
          )}
          <DataFields
            fields={genericLicense?.payload?.data ?? []}
            licenseType={licenseType}
            pkPass={genericLicense?.license.pkpass}
          />
        </>
      )}
    </>
  )
}

export default LicenseDetail
