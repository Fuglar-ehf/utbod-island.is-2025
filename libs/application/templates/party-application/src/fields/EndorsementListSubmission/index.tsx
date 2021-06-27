import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Text,
  RadioButton,
  IconDeprecated as Icon,
  Pagination,
} from '@island.is/island-ui/core'
import EndorsementTable from '../EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import isEqual from 'lodash/isEqual'
import { constituencyMapper, EndorsementListTags } from '../../constants'
import sortBy from 'lodash/sortBy'
import cloneDeep from 'lodash/cloneDeep'
import { Endorsement } from '../../types/schema'
import { useEndorsements } from '../../hooks/fetch-endorsements'
import { SchemaFormValues } from '../../../src/lib/dataSchema'
import { useFormContext } from 'react-hook-form'
import { paginate, totalPages as pages } from '../components/utils'

const EndorsementListSubmission: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const answers = application.answers as SchemaFormValues
  const [endorsementsPage, setEndorsementsPage] = useState<
    Endorsement[] | undefined
  >()
  const [selectedEndorsements, setSelectedEndorsements] = useState<
    Endorsement[] | undefined
  >([])
  const [autoSelect, setAutoSelect] = useState(false)
  const [chooseRandom, setChooseRandom] = useState(false)
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const { endorsements: endorsementsHook } = useEndorsements(
    endorsementListId,
    false,
  )
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  /* on intital render: decide which radio button should be checked */
  useEffect(() => {
    if (endorsementsHook) {
      if (answers.endorsements && answers.endorsements.length > 0) {
        const endorsements: any = endorsementsHook?.filter((e: any) => {
          return answers.endorsements?.indexOf(e.id) !== -1
        })

        setSelectedEndorsements(sortBy(endorsements, 'created'))
        isEqual(endorsements, firstX())
          ? setAutoSelect(true)
          : setChooseRandom(true)
      } else {
        firstMaxEndorsements()
        setAutoSelect(true)
      }
      setEndorsementsPage(endorsementsHook)
      handlePagination(1, endorsementsHook)
    }
  }, [endorsementsHook])

  const maxEndorsements =
    constituencyMapper[answers.constituency as EndorsementListTags]
      .parliamentary_seats * 40
  const minEndorsements =
    constituencyMapper[answers.constituency as EndorsementListTags]
      .parliamentary_seats * 30
  const showWarning =
    (selectedEndorsements && selectedEndorsements.length > maxEndorsements) ||
    (selectedEndorsements && selectedEndorsements.length < minEndorsements)
  const firstX = () => {
    const tempEndorsements = [...(endorsementsHook ?? [])]
    return tempEndorsements?.slice(0, maxEndorsements)
  }
  const shuffled = () => {
    const tempEndorsements = [...(endorsementsHook ?? [])]
    return tempEndorsements?.sort(() => 0.5 - Math.random())
  }

  const firstMaxEndorsements = () => {
    setAutoSelect(true)
    setChooseRandom(false)
    setSelectedEndorsements([...firstX()])
    updateApplicationWithEndorsements([...firstX()])
  }

  const randomize = () => {
    setAutoSelect(false)
    setChooseRandom(true)
    const random = shuffled().slice(0, maxEndorsements)
    setSelectedEndorsements([...random])
    updateApplicationWithEndorsements([...random])
  }

  const handleCheckboxChange = (endorsement: Endorsement) => {
    setAutoSelect(false)
    setChooseRandom(true)
    if (selectedEndorsements?.some((e) => e.id === endorsement.id)) {
      deselectEndorsement(endorsement)
    } else {
      const addToEndorsements = [
        ...(selectedEndorsements ? selectedEndorsements : []),
        endorsement,
      ]
      setSelectedEndorsements(addToEndorsements)
      updateApplicationWithEndorsements(addToEndorsements)
    }
  }

  const deselectEndorsement = (endorsement: Endorsement) => {
    const removeFromSelected = selectedEndorsements?.filter(
      (e) => e.id !== endorsement.id,
    )
    setSelectedEndorsements([...(removeFromSelected ? removeFromSelected : [])])
    updateApplicationWithEndorsements([
      ...(removeFromSelected ? removeFromSelected : []),
    ])
  }

  const updateApplicationWithEndorsements = async (
    newEndorsements: Endorsement[],
  ) => {
    const endorsementIds: string[] = newEndorsements.map((e) => e.id)
    setValue('endorsements', cloneDeep(endorsementIds))
  }

  const handlePagination = (
    page: number,
    endorsements: Endorsement[] | undefined,
  ) => {
    const sortEndorements = sortBy(endorsements, 'created')
    setPage(page)
    setTotalPages(pages(endorsementsHook?.length))
    setEndorsementsPage(paginate(sortEndorements, 10, page))
  }

  return (
    <Box marginBottom={8}>
      <Text>{formatMessage(m.endorsementListSubmission.description)}</Text>
      {endorsementsHook && endorsementsHook.length > 0 && (
        <Box>
          <Box
            marginTop={3}
            marginBottom={3}
            display="flex"
            alignItems="center"
            justifyContent="flexStart"
          >
            <RadioButton
              id="autoSelect"
              label={
                formatMessage(m.endorsementListSubmission.selectAuto) +
                (endorsementsHook.length < maxEndorsements
                  ? endorsementsHook.length
                  : maxEndorsements)
              }
              checked={autoSelect}
              onChange={() => {
                firstMaxEndorsements()
              }}
            />
            <Box marginLeft={5}>
              <RadioButton
                id="chooseManually"
                label={formatMessage(m.endorsementListSubmission.selectRandom)}
                checked={chooseRandom}
                onChange={() => {
                  randomize()
                }}
              />
            </Box>
          </Box>
          <EndorsementTable
            application={application}
            endorsements={sortBy(endorsementsPage, 'created')}
            selectedEndorsements={selectedEndorsements}
            onTableSelect={(endorsement) => handleCheckboxChange(endorsement)}
          />
          {!!endorsementsHook?.length && (
            <Box marginY={3}>
              <Pagination
                page={page}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <Box
                    cursor="pointer"
                    className={className}
                    onClick={() => handlePagination(page, endorsementsHook)}
                  >
                    {children}
                  </Box>
                )}
              />
            </Box>
          )}
          <Box
            marginTop={3}
            display="flex"
            alignItems="center"
            justifyContent="spaceBetween"
          >
            <Text fontWeight="semiBold" variant="small">
              {formatMessage(m.endorsementListSubmission.chosenEndorsements)}
            </Text>
            <Text variant="h5">
              {selectedEndorsements?.length +
                '/' +
                (endorsementsHook.length < maxEndorsements
                  ? endorsementsHook.length
                  : maxEndorsements)}
            </Text>
          </Box>
          {showWarning && (
            <Box
              marginTop={5}
              background="yellow200"
              display="flex"
              alignItems="center"
              padding={3}
              borderRadius="large"
              borderColor="yellow400"
              borderWidth="standard"
            >
              <Icon type="alert" color="yellow600" width={26} />
              <Box marginLeft={3}>
                {selectedEndorsements &&
                  selectedEndorsements.length > maxEndorsements && (
                    <Text fontWeight="semiBold" variant="small">
                      {formatMessage(
                        m.endorsementListSubmission.warningMessageTitleHigh,
                      )}
                    </Text>
                  )}
                {selectedEndorsements &&
                  selectedEndorsements.length < minEndorsements && (
                    <Text fontWeight="semiBold" variant="small">
                      {formatMessage(
                        m.endorsementListSubmission.warningMessageTitleLow,
                      )}
                    </Text>
                  )}
                <Text variant="small">
                  {formatMessage(
                    m.endorsementListSubmission.warningMessagePt1,
                  ) +
                    minEndorsements +
                    ' - ' +
                    maxEndorsements +
                    formatMessage(
                      m.endorsementListSubmission.warningMessagePt2,
                    )}
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default EndorsementListSubmission
