import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Inline, Input, Tooltip } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { SchemaFormValues } from '../../lib/dataSchema'
import { constituencyMapper, EndorsementListTags } from '../../constants'
import { useEndorsements } from '../../hooks/fetch-endorsements'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const Overview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const answers = application.answers as SchemaFormValues
  const endorsementListId = (externalData?.createEndorsementList.data as any).id
  const { endorsements: endorsementHook } = useEndorsements(
    endorsementListId,
    false,
  )
  const constituency =
    constituencyMapper[answers.constituency as EndorsementListTags]

  //find selected endorsements from the endorsement system and find how many of them are with region mismatch
  const endorsementsWithWarning = () => {
    const intersectingEndorsements = endorsementHook?.filter((e: any) => {
      return answers.endorsements?.indexOf(e.id) !== -1
    })

    return intersectingEndorsements?.filter(
      (e) =>
        e.meta.voterRegion?.voterRegionNumber !== constituency.region_number,
    ).length
  }

  const { register } = useFormContext()

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h3">{formatMessage(m.overviewSection.subtitle)}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.responsiblePerson)}
        </Text>
        <Text>
          {
            (externalData.nationalRegistry?.data as {
              fullName?: string
            })?.fullName
          }
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">{formatMessage(m.overviewSection.partyType)}</Text>
        <Text>{'Alþingiskosningar 2021'}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.constituency)}
        </Text>
        <Text>{constituency.region_name}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.signatureCount)}
        </Text>
        <Text>{answers.endorsements?.length ?? 0}</Text>
      </Box>
      <Box marginBottom={3}>
        <Inline space={2}>
          <Text variant="h5">
            {formatMessage(m.overviewSection.signaturesInvalidTitle)}
          </Text>
          <Box>
            <Tooltip
              color="yellow600"
              iconSize="medium"
              text={formatMessage(m.overviewSection.signaturesInvalid)}
            />
          </Box>
        </Inline>
        <Text>{endorsementsWithWarning()}</Text>
      </Box>
      <Box marginBottom={3} width="half">
        <Text variant="h5" marginBottom={2}>
          {formatMessage(m.overviewSection.emailLabel)}
        </Text>
        <Input
          id="responsiblePersonEmail"
          name="responsiblePersonEmail"
          backgroundColor="blue"
          label={formatMessage(m.overviewSection.emailPlaceholder)}
          ref={register}
          defaultValue=""
        />
      </Box>
    </>
  )
}

export default Overview
