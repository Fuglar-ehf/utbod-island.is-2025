import React, { FC } from 'react'
import { Box, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { Ceremony, Individual, PersonalInfo } from '../../types'
import { format as formatNationalId } from 'kennitala'
import format from 'date-fns/format'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { States, YES } from '../../lib/constants'

type InfoProps = {
  side: Individual
}

export const ApplicationOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const applicant = answers.applicant as Individual
  const spouse = answers.spouse as Individual
  const witness1 = answers.witness1 as Individual
  const witness2 = answers.witness2 as Individual

  const InfoSection: FC<InfoProps> = ({ side }) => {
    return (
      <Box>
        <Box display="flex" marginBottom={3}>
          <Box width="half">
            <Text variant="h4">{formatMessage(m.name)}</Text>
            <Text>{side.person.name}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{formatMessage(m.nationalId)}</Text>
            <Text>{formatNationalId(side.person.nationalId)}</Text>
          </Box>
        </Box>
        <Box display="flex">
          <Box width="half">
            <Text variant="h4">{formatMessage(m.phone)}</Text>
            <Text>{formatPhoneNumber(side.phone)}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{formatMessage(m.email)}</Text>
            <Text>{side.email}</Text>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationSpouse1)}
        </Text>
        <InfoSection side={applicant} />
      </Box>
      <Box marginTop={4}>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationSpouse2)}
        </Text>
        <InfoSection side={spouse} />
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
      </Box>
      <Box>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.personalInformationTitle)}
        </Text>
        <Box>
          <Box display="flex" marginBottom={3}>
            <Box width="half">
              <Text variant="h4">{formatMessage(m.address)}</Text>
              <Text>
                {application.state === States.SPOUSE_CONFIRM
                  ? (answers.spousePersonalInfo as PersonalInfo).address
                  : (answers.personalInfo as PersonalInfo).address}
              </Text>
            </Box>
            <Box width="half">
              <Text variant="h4">{formatMessage(m.citizenship)}</Text>
              <Text>
                {application.state === States.SPOUSE_CONFIRM
                  ? (answers.spousePersonalInfo as PersonalInfo).citizenship
                  : (answers.personalInfo as PersonalInfo).citizenship}
              </Text>
            </Box>
          </Box>
          <Box display="flex">
            <Box width="half">
              <Text variant="h4">{formatMessage(m.maritalStatus)}</Text>
              <Text>
                {(answers.personalInfo as PersonalInfo).maritalStatus}
              </Text>
            </Box>
            {answers.maritalStatus === 'DIVORCED' ||
              ((answers.fakeData as PersonalInfo).maritalStatus === '6' && (
                <Box width="half">
                  <Text variant="h4">
                    {formatMessage(m.previousMarriageTermination)}
                  </Text>
                  <Text>
                    {
                      (answers.personalInfo as PersonalInfo)
                        .previousMarriageTermination
                    }
                  </Text>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
      </Box>
      <Box>
        <Text variant="h3">{formatMessage(m.ceremony)}</Text>
        {(answers.ceremony as Ceremony).hasDate === YES ? (
          <Box marginTop={3}>
            <Box display="flex" marginBottom={3}>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.ceremonyDate)}</Text>
                <Text>
                  {format(
                    new Date((answers.ceremony as Ceremony).date),
                    'dd/MM/yyyy',
                  )}
                </Text>
              </Box>
            </Box>
            <Box display="flex">
              <Box width="half">
                <Text variant="h4">{formatMessage(m.ceremonyPlace)}</Text>
                {(answers.ceremony as Ceremony).ceremonyPlace === 'office' ? (
                  <Text>{(answers.ceremony as Ceremony).office}</Text>
                ) : (
                  <Text>{(answers.ceremony as Ceremony).society}</Text>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Text variant="default">
            {'Hjónavígsludagurinn liggur ekki fyrir.'}
          </Text>
        )}
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
      </Box>
      <Box>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationWitness1)}
        </Text>
        <InfoSection side={witness1} />
      </Box>
      <Box marginTop={4}>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationWitness2)}
        </Text>
        <InfoSection side={witness2} />
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
      </Box>
      <Box>
        <Text>{formatMessage(m.overviewFooterText)}</Text>
      </Box>
    </>
  )
}
