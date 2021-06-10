import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { Endorsement } from '../../lib/dataSchema'
import { GetEndorsements } from '../../graphql/queries'
import BulkUpload from '../BulkUpload'

interface EndorsementData {
  endorsementSystemGetEndorsements?: Endorsement[]
}
const EndorsementList: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const [searchTerm, setSearchTerm] = useState('')
  const [endorsements, setEndorsements] = useState<Endorsement[] | undefined>()
  const [showWarning, setShowWarning] = useState(false)
  const [updateOnBulkImport, setUpdateOnBulkImport] = useState(false)

  const {
    data: endorsementsData,
    loading,
    error,
    refetch,
  } = useQuery<EndorsementData>(GetEndorsements, {
    variables: {
      input: {
        listId: endorsementListId,
      },
    },
    pollInterval: 20000,
  })

  useEffect(() => {
    refetch()
    const mapToEndorsementList:
      | Endorsement[]
      | undefined = endorsementsData?.endorsementSystemGetEndorsements?.map(
      (x: any) => ({
        date: x.created,
        name: x.meta.fullName,
        nationalId: x.endorser,
        address: x.meta.address ? x.meta.address.streetAddress : '',
        hasWarning: x.meta?.invalidated ?? false,
        id: x.id,
        bulkImported: x.meta?.bulkEndorsement ?? false,
      }),
    )

    setEndorsements(mapToEndorsementList)
  }, [endorsementsData, updateOnBulkImport])

  const namesCountString = formatMessage(
    endorsements && endorsements.length > 1
      ? m.endorsementList.namesCount
      : m.endorsementList.nameCount,
  )

  return (
    <Box marginBottom={8}>
      <CopyLink
        linkUrl={window.location.href}
        buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
      />
      <Text variant="h3">{`${
        endorsements && endorsements.length > 0 ? endorsements.length : 0
      } ${namesCountString}`}</Text>
      <Box marginTop={2}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={3}
        >
          <Checkbox
            label={formatMessage(m.endorsementList.invalidSignatures)}
            checked={showWarning}
            onChange={() => {
              setShowWarning(!showWarning)
              setSearchTerm('')
              showWarning
                ? setEndorsements(endorsements)
                : setEndorsements(
                    endorsements
                      ? endorsements.filter((x) => x.hasWarning)
                      : endorsements,
                  )
            }}
          />

          <Input
            name="searchbar"
            placeholder={formatMessage(m.endorsementList.searchbar)}
            icon="search"
            backgroundColor="blue"
            size="sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setEndorsements(
                endorsements && endorsements.length > 0
                  ? endorsements.filter((x) =>
                      (x.name ?? '').startsWith(e.target.value),
                    )
                  : endorsements,
              )
            }}
          />
        </Box>
        {endorsements && endorsements.length > 0 && (
          <Box marginY={3}>
            <EndorsementTable
              application={application}
              endorsements={endorsements}
            />
          </Box>
        )}
        <Box marginY={5}>
          <BulkUpload
            application={application}
            onSuccess={() => {
              setUpdateOnBulkImport(true)
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default EndorsementList
