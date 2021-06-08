import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Text, Box, Button, Input, AlertMessage } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useMutation, useQuery } from '@apollo/client'
import EndorsementApproved from '../EndorsementApproved'
import { GetFullName, GetEndorsements, GetVoterRegion } from '../../graphql/queries'
import { EndorseList } from '../../graphql/mutations'
import { PartyLetterRegistryPartyLetter } from '../../dataProviders/partyLetterRegistry'

const EndorsementDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const [agreed, setAgreed] = useState(false)
  const [hasEndorsed, setHasEndorsed] = useState(false)
  const [createEndorsement, { loading: submitLoad }] = useMutation(EndorseList)
  const { externalData } = application
  const party: PartyLetterRegistryPartyLetter = externalData
    ?.partyLetterRegistry?.data as PartyLetterRegistryPartyLetter

  const constituency = application.answers.constituency
  const { data: userData } = useQuery(GetFullName)
  const { data: voterRegion } = useQuery(GetVoterRegion)
  const regionMismatch = constituency !== voterRegion?.temporaryVoterRegistryGetVoterRegion.regionName
  const { loading, error } = useQuery(GetEndorsements, {
    onCompleted: async ({ endorsementSystemUserEndorsements }) => {
      if (!loading && endorsementSystemUserEndorsements) {
        const hasEndorsements =
          !error && !loading && endorsementSystemUserEndorsements?.length
            ? endorsementSystemUserEndorsements.length > 0
            : false
        setHasEndorsed(hasEndorsements)
      }
    },
  })

  const onEndorse = async () => {
    const success = await createEndorsement({
      variables: {
        input: {
          listId: (application.externalData?.createEndorsementList.data as any)
            .id,
        },
      },
    })
    if (success) {
      setHasEndorsed(true)
    }
  }

  return (
    <>
      {!loading && !hasEndorsed ? (
        <EndorsementApproved />
      ) : (
        <Box>
          <Box marginBottom={2}>
            <Text variant="h2" marginBottom={3}>
              {`${formatMessage(m.endorsementDisclaimer.title)} ${party.partyLetter}`}
            </Text>
            <Text marginBottom={2}>
              {`${formatMessage(
                m.endorsementDisclaimer.messagePt1,
              )} ${constituency} ${formatMessage(
                m.endorsementDisclaimer.messagePt2,
              )} `}
            </Text>
          </Box>

          <Box width="half" marginBottom={4}>
            <Input
              disabled
              label={formatMessage(m.collectEndorsements.nameInput)}
              name={formatMessage(m.collectEndorsements.nameInput)}
              value={userData?.nationalRegistryUser?.fullName}
              defaultValue={''}
              backgroundColor="blue"
            />
          </Box>
          <Box display={['block', 'block', 'flex']} marginBottom={5}>
            <Box>
              <Text variant="h4">
                {formatMessage(m.endorsementDisclaimer.partyLetter)}
              </Text>
              <Text>{`${party.partyLetter} `}</Text>
            </Box>
            <Box marginLeft={[0, 0, 12]}>
              <Text variant="h4">
                {formatMessage(m.endorsementDisclaimer.partyName)}
              </Text>
              <Text>{party.partyName}</Text>
            </Box>
          </Box>
          <Box marginBottom={4}>
            <FieldDescription
              description={formatMessage(
                m.endorsementDisclaimer.descriptionPt1,
              )}
            />
          </Box>
          <Box marginBottom={5}>
            <FieldDescription
              description={formatMessage(
                m.endorsementDisclaimer.descriptionPt2,
              )}
            />
          </Box>
          {regionMismatch && (
            <Box marginY={5}>
              <AlertMessage
                type="warning"
                title="Athugið"
                message={formatMessage(m.endorsementDisclaimer.regionMismatch)}
              />
            </Box>
          )}
          <CheckboxController
            id="terms"
            name="tere"
            large={true}
            backgroundColor="blue"
            defaultValue={[]}
            onSelect={() => setAgreed(!agreed)}
            options={[
              {
                value: 'agree',
                label: formatMessage(m.collectEndorsements.agreeTermsLabel),
              },
            ]}
          />
          <Box
            marginTop={5}
            marginBottom={8}
            display="flex"
            justifyContent="flexEnd"
          >
            <Button
              loading={submitLoad}
              disabled={!agreed}
              icon="arrowForward"
              onClick={() => onEndorse()}
            >
              {formatMessage(m.collectEndorsements.submitButton)}
            </Button>
          </Box>
        </Box>
      )}
    </>
  )
}

export default EndorsementDisclaimer
