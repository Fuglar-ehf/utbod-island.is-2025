import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Icon,
  Stack,
  Text,
  Button,
  AlertBanner,
  Link,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { formatDate } from '../../utils/dateUtils'
import { m } from '../../lib/messages'
import {
  GetChildrenIdentityDocumentQuery,
  GetIdentityDocumentQuery,
  IdentityDocumentModel,
  IdentityDocumentModelChild,
  useChildrenPassport,
} from '@island.is/service-portal/graphql'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { FeatureFlagClient } from '@island.is/feature-flags'
import * as styles from './PassportDetail.css'
import { Gender, GenderType } from '../../types/passport.type'
import { applyPassport, lostPassport } from '../../lib/constants'
import { useLazyQuery } from '@apollo/client'
import { capitalizeEveryWord } from '../../utils/capitalize'
import { NotFound } from '@island.is/portals/core'

const getCurrentPassport = (
  id: string | undefined,
  data?: IdentityDocumentModelChild[] | null,
) => {
  let pass = null

  if (!data) return pass

  for (const passport of data) {
    pass = passport?.passports?.find((x) => x.numberWithType === id)
    if (pass) break
  }

  return pass
}

const NotifyLostLink = (text: string) => (
  <Link href={lostPassport}>
    <Button variant="utility" size="small" icon="open" iconType="outline">
      {text}
    </Button>
  </Link>
)

const PassportDetail: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const [passportEnabled, setPassportEnabled] = useState(false)
  const [blockedAccess, setBlockedAccess] = useState(false)
  const { formatMessage, lang } = useLocale()
  const { id }: { id: string | undefined } = useParams()

  const [
    getPassportData,
    { data: identityDocumentData, loading, error },
  ] = useLazyQuery(GetIdentityDocumentQuery)

  const [
    getPassportDataChild,
    { data: childIdentityDocumentData },
  ] = useLazyQuery(GetChildrenIdentityDocumentQuery)

  useEffect(() => {
    const isPassportFlagEnabled = async () => {
      const isPassEnabled = Boolean(
        await featureFlagClient.getValue(
          `isServicePortalPassportPageEnabled`,
          false,
        ),
      )

      setPassportEnabled(isPassEnabled)
      setBlockedAccess(!isPassEnabled)
    }
    isPassportFlagEnabled()
  }, [])

  useEffect(() => {
    if (passportEnabled) {
      getPassportData()
      getPassportDataChild()
    }
  }, [passportEnabled])

  const passportGender: Gender = {
    F: formatMessage(m.female),
    M: formatMessage(m.male),
    X: formatMessage(m.otherGender),
  }
  const passportData = identityDocumentData?.getIdentityDocument as
    | IdentityDocumentModel[]
    | undefined

  const childPassportData = childIdentityDocumentData?.getIdentityDocumentChildren as
    | IdentityDocumentModelChild[]
    | undefined

  const data =
    passportData?.find((x) => x.numberWithType === id) ||
    getCurrentPassport(id, childPassportData) ||
    null

  const licenseExpired = data?.expiryStatus === 'EXPIRED'
  const licenseLost = data?.expiryStatus === 'LOST'
  const isInvalid = data?.status?.toLowerCase() === 'invalid'
  const expireWarning = data?.expiresWithinNoticeTime

  return (
    <>
      {error && !loading && (
        <Box>
          <AlertBanner
            description={formatMessage(m.errorFetchingPassport)}
            variant="error"
          />
        </Box>
      )}
      {blockedAccess ? (
        <NotFound />
      ) : (
        <Box marginBottom={3}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '5/8', '5/8']}>
              <Stack space={1}>
                <Text variant="h3" as="h1" paddingTop={0}>
                  {data?.verboseType || ''}
                </Text>
                <Text as="p" variant="default">
                  {formatMessage(m.passportDescription)}
                </Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </Box>
      )}
      {data && (
        <Stack space={2}>
          {licenseExpired || expireWarning || licenseLost ? (
            <GridRow>
              <GridColumn span={['12/12', '12/12', '5/8', '5/8']}>
                <Box marginBottom={5}>
                  <AlertMessage
                    type="warning"
                    title={
                      licenseExpired || licenseLost
                        ? formatMessage(m.passportInvalid)
                        : formatMessage(m.passportExpiring)
                    }
                    message={
                      licenseExpired || licenseLost
                        ? formatMessage(m.passportInvalidText)
                        : formatMessage(m.passportExpiringText)
                    }
                  />
                </Box>

                <Box display="flex" flexDirection="row" alignItems="center">
                  <Link className={styles.renew} href={applyPassport}>
                    <Button
                      variant="utility"
                      size="small"
                      icon="open"
                      iconType="outline"
                    >
                      {formatMessage(m.passportRenew)}
                    </Button>
                  </Link>
                  {NotifyLostLink(formatMessage(m.passportNotifyLost))}
                </Box>
              </GridColumn>
            </GridRow>
          ) : (
            <GridRow marginBottom={2}>
              <GridColumn span={['12/12', '12/12', '5/8', '5/8']}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  {NotifyLostLink(formatMessage(m.passportNotifyLost))}
                </Box>
              </GridColumn>
            </GridRow>
          )}
          <UserInfoLine
            label={defineMessage(m.passportName)}
            content={capitalizeEveryWord(
              data?.displayFirstName + ' ' + data?.displayLastName,
            )}
            loading={loading}
            titlePadding={3}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={m.passportNumberShort}
            content={data?.numberWithType || ''}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={m.issueDate}
            content={data.issuingDate ? formatDate(data.issuingDate, lang) : ''}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={m.expireDate}
            renderContent={() => (
              <Box display="flex" alignItems="center">
                <Text>
                  {data.expirationDate
                    ? formatDate(data.expirationDate, lang)
                    : ''}
                </Text>
                <Box
                  marginLeft={3}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  textAlign="center"
                >
                  <Box
                    marginRight={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                  >
                    <Icon
                      icon={isInvalid ? 'closeCircle' : 'checkmarkCircle'}
                      color={
                        isInvalid
                          ? 'red600'
                          : expireWarning
                          ? 'yellow600'
                          : 'mint600'
                      }
                      type="filled"
                    />
                  </Box>
                  <Text variant="eyebrow">
                    {isInvalid
                      ? formatMessage(licenseLost ? m.lost : m.isExpired)
                      : formatMessage(m.isValid)}
                  </Text>
                </Box>
              </Box>
            )}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(m.passportNameComputer)}
            content={data.mrzLastName + ' ' + data.mrzFirstName}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(m.passportGender)}
            content={passportGender[data.sex as GenderType] || ''}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <Box marginY={3} />
        </Stack>
      )}
    </>
  )
}

export default PassportDetail
