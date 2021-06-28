import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { ExportAsCSV } from '@island.is/application/ui-components'
import { SchemaFormValues } from '../../lib/dataSchema'
import { csvFileName } from '../../constants'
import { PartyLetterRegistry } from '@island.is/api/schema'
import { constituencyMapper, EndorsementListTags } from '../../constants'
import { useEndorsements } from '../../hooks/fetch-endorsements'
import { Endorsement } from '../../types/schema'
import format from 'date-fns/format'
import { format as formatKennitala } from 'kennitala'
import sortBy from 'lodash/sortBy'

const mapToCSVFile = (endorsements: Endorsement[], constituency: string) => {
  return endorsements.map((endorsement) => {
    return {
      Kennitala: formatKennitala(endorsement.endorser),
      Dagsetning: format(new Date(endorsement.created), 'dd.MM.yyyy'),
      Nafn: endorsement.meta.fullName ?? '',
      Heimilisfang: endorsement.meta.address.streetAddress ?? '',
      Póstnúmer: endorsement.meta.address.postalCode ?? '',
      Borg: endorsement.meta.address.city ?? '',
      'Meðmæli í vafa':
        constituency !== endorsement.meta.voterRegion ? 'X' : '',
      'Meðmæli á pappír': endorsement.meta.bulkEndorsement ? 'X' : '',
    }
  })
}

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const SupremeCourtOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const answers = application.answers as SchemaFormValues
  const partyLetterRegistry = externalData.partyLetterRegistry
    .data as PartyLetterRegistry
  const endorsementListId = (externalData?.createEndorsementList.data as any).id
  const { endorsements } = useEndorsements(endorsementListId, false)
  const constituency =
    constituencyMapper[answers.constituency as EndorsementListTags].region_name

  return (
    <Box>
      <Text variant="h3"> {formatMessage(m.supremeCourt.subtitle)}</Text>
      <Box display="flex" marginTop={3} marginBottom={5}>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.partyNameLabel)}
          </Text>
          <Text>{answers.partyName}</Text>
        </Box>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.partyLetterLabel)}
          </Text>
          <Text>{answers.partyLetter}</Text>
        </Box>
      </Box>
      <Box display="flex" marginBottom={5}>
        <Box width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.responsiblePersonLabel)}
          </Text>
          <Text>
            {
              (externalData.nationalRegistry?.data as {
                fullName?: string
              })?.fullName
            }
          </Text>
        </Box>
        <Box marginBottom={3} width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.typeOfEndorsementLabel)}
          </Text>
          <Text>{'Alþingi 2021'}</Text>
        </Box>
      </Box>
      <Box display="flex">
        <Box marginBottom={3} width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.numberOfEndorsementsLabel)}
          </Text>
          <Text marginBottom={1}>{answers.endorsements?.length}</Text>
          <Box marginTop={3} marginBottom={5}>
            {endorsements?.length && (
              <ExportAsCSV
                data={
                  mapToCSVFile(
                    sortBy(endorsements, 'created'),
                    constituency,
                  ) as object[]
                }
                filename={csvFileName(
                  partyLetterRegistry?.partyLetter,
                  partyLetterRegistry?.partyName,
                )}
                title={formatMessage(m.supremeCourt.csvButton)}
              />
            )}
          </Box>
        </Box>
        <Box marginBottom={3} width="half">
          <Text variant="h5">
            {formatMessage(m.supremeCourt.constituencyLabel)}
          </Text>
          <Text>{constituency}</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default SupremeCourtOverview
