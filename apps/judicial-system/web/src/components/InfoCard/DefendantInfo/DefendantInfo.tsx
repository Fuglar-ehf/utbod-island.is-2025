import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'
import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'
import {
  Defendant,
  ServiceRequirement,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { Defender } from '../InfoCard'
import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'
import { strings } from './DefendantInfo.strings'
import * as styles from './DefendantInfo.css'

export type DefendantInfoActionButton = {
  text: string
  onClick: (defendant: Defendant) => void
  icon?: IconMapIcon
  isDisabled: (defendant: Defendant) => boolean
}

interface DefendantInfoProps {
  defendant: Defendant
  displayAppealExpirationInfo?: boolean
  defendantInfoActionButton?: DefendantInfoActionButton
  displayVerdictViewDate?: boolean
  defender?: Defender
}

export const getAppealExpirationInfo = (
  viewDate?: string | null,
  serviceRequirement?: ServiceRequirement | null,
) => {
  if (!viewDate) {
    return { message: strings.appealDateNotBegun, data: null }
  }

  if (serviceRequirement === ServiceRequirement.NOT_REQUIRED) {
    return { message: strings.serviceRequirementNotRequired, data: null }
  }

  if (serviceRequirement === ServiceRequirement.NOT_APPLICABLE) {
    return { message: strings.serviceRequirementNotApplicable, data: null }
  }

  const today = new Date()
  const expiryDate = new Date(viewDate)
  expiryDate.setDate(expiryDate.getDate() + 28)

  const message =
    today < expiryDate
      ? strings.appealExpirationDate
      : strings.appealDateExpired

  return { message, data: formatDate(expiryDate) }
}

export const DefendantInfo: FC<DefendantInfoProps> = (props) => {
  const {
    defendant,
    displayAppealExpirationInfo,
    defendantInfoActionButton,
    displayVerdictViewDate,
    defender,
  } = props
  const { formatMessage } = useIntl()

  const appealExpirationInfo = getAppealExpirationInfo(
    defendant.verdictViewDate,
    defendant.serviceRequirement,
  )

  console.log(defender)
  return (
    <div
      key={defendant.id}
      className={
        defendantInfoActionButton
          ? styles.gridRow.withButton
          : styles.gridRow.withoutButton
      }
    >
      <div className={styles.infoCardDefendant}>
        <span>
          <Text as="span" fontWeight="semiBold">
            {defendant.name}
            {defendant.nationalId &&
              `, ${formatDOB(defendant.nationalId, defendant.noNationalId)}`}
          </Text>
          <Text as="span" fontWeight="light">
            {defendant.citizenship && `, (${defendant.citizenship})`}
            {defendant.address && `, ${defendant.address}`}
          </Text>
        </span>
        {defendant.defenderName || defender?.name ? (
          <Box display={['block', 'block', 'block', 'flex']}>
            <Text as="span" whiteSpace="pre">
              {defender?.sessionArrangement ===
              SessionArrangements.ALL_PRESENT_SPOKESPERSON
                ? `${formatMessage(strings.spokesperson)}: `
                : `${formatMessage(strings.defender)}: `}
            </Text>
            {RenderPersonalData(
              defendant.defenderName || defender?.name,
              defendant.defenderEmail || defender?.email,
              defendant.defenderPhoneNumber || defender?.phoneNumber,
              false,
            )}
          </Box>
        ) : (
          <Text>{`${formatMessage(strings.defender)}: ${formatMessage(
            strings.noDefender,
          )}`}</Text>
        )}
        {displayAppealExpirationInfo && (
          <Box>
            <Text as="span">
              {formatMessage(appealExpirationInfo.message, {
                appealExpirationDate: appealExpirationInfo.data,
              })}
            </Text>
          </Box>
        )}
        {displayVerdictViewDate && (
          <Text>
            {formatMessage(strings.verdictDisplayedDate, {
              date: formatDate(defendant.verdictViewDate, 'PPP'),
            })}
          </Text>
        )}
      </div>
      {defendantInfoActionButton && (
        <Box>
          <Button
            variant="text"
            size="small"
            onClick={() => defendantInfoActionButton.onClick(defendant)}
            icon={defendantInfoActionButton.icon}
            iconType="outline"
            disabled={defendantInfoActionButton.isDisabled(defendant)}
          >
            {defendantInfoActionButton.text}
          </Button>
        </Box>
      )}
    </div>
  )
}
