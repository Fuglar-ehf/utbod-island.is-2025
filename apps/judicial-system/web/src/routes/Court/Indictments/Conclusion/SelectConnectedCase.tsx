import React, { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  LoadingDots,
  Select,
} from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

import { useConnectedCasesQuery } from './connectedCases.generated'
import { strings } from './SelectConnectedCase.strings'

type ConnectedCaseOption = ReactSelectOption & { connectedCase: Case }

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

const SelectConnectedCase: FC<Props> = ({ workingCase, setWorkingCase }) => {
  const { formatMessage } = useIntl()

  const { data: connectedCasesData, loading: connectedCasesLoading } =
    useConnectedCasesQuery({
      variables: {
        input: {
          id: workingCase.id,
        },
      },
    })

  const setConnectedCase = async (connectedCaseId: string) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      mergeCase: {
        id: connectedCaseId,
      },
    }))
  }

  const connectedCases = connectedCasesData?.connectedCases?.map((aCase) => ({
    label: `${aCase.courtCaseNumber}`,
    value: aCase.id,
  })) as ConnectedCaseOption[]

  const defaultConnectedCase = connectedCases?.find(
    (connectedCase) =>
      workingCase.mergeCase &&
      connectedCase.value === workingCase.mergeCase?.id,
  )

  return connectedCasesLoading ? (
    <Box
      textAlign="center"
      paddingY={2}
      paddingX={3}
      marginBottom={2}
      key="loading-dots"
    >
      <LoadingDots />
    </Box>
  ) : connectedCases?.length === 0 ? (
    <AlertMessage
      type={'warning'}
      title={formatMessage(strings.noConnectedCasesTitle)}
      message={formatMessage(strings.noConnectedCasesMessage)}
    />
  ) : (
    <Select
      name="connectedCase"
      label={formatMessage(strings.connectedCaseLabel)}
      options={connectedCases}
      value={defaultConnectedCase}
      placeholder={formatMessage(strings.connectedCasePlaceholder)}
      onChange={(selectedOption) => {
        if (!selectedOption) {
          return
        }
        setConnectedCase(selectedOption.value as string)
      }}
      isDisabled={connectedCasesLoading}
    />
  )
}

export default SelectConnectedCase
