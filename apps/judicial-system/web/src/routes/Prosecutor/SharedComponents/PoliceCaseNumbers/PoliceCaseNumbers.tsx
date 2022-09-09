import React, { useContext, useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, Tag } from '@island.is/island-ui/core'
import type { Case } from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { policeCaseNumber as m } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  MultipleValueList,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  clientPoliceNumbers: string[]
  setClientPoliceNumbers: React.Dispatch<React.SetStateAction<string[]>>
}

// Needed so that users can remove all loke numbers in client without syncing to server
export const usePoliceCaseNumbers = (workingCase: Case) => {
  const [clientPoliceNumbers, setClientPoliceNumbers] = useState<string[]>(
    workingCase.policeCaseNumbers,
  )
  useEffect(() => {
    if (workingCase.id) {
      setClientPoliceNumbers(workingCase.policeCaseNumbers)
    }
  }, [workingCase.id, workingCase.policeCaseNumbers])

  return { clientPoliceNumbers, setClientPoliceNumbers }
}

const PoliceCaseNumbers: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    clientPoliceNumbers,
    setClientPoliceNumbers,
  } = props
  const { user } = useContext(UserContext)
  const { setAndSendToServer } = useCase()
  const { formatMessage } = useIntl()

  const [hasError, setHasError] = useState(false)
  const updatePoliceNumbers = useCallback(
    (newPoliceCaseNumbers: string[]) => {
      setClientPoliceNumbers(newPoliceCaseNumbers)
      setAndSendToServer(
        [
          {
            policeCaseNumbers: newPoliceCaseNumbers,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    },
    [workingCase, setWorkingCase, setAndSendToServer, setClientPoliceNumbers],
  )

  const onAdd = useCallback(
    (value: string) => {
      if (validate([[value, ['empty', 'police-casenumber-format']]]).isValid) {
        updatePoliceNumbers([...clientPoliceNumbers, value])
        setHasError(false)
      }
    },
    [clientPoliceNumbers, updatePoliceNumbers, setHasError],
  )

  const onRemove = useCallback(
    (value) => () => {
      const newPoliceCaseNumbers = clientPoliceNumbers.filter(
        (number) => number !== value,
      )
      if (newPoliceCaseNumbers.length > 0) {
        updatePoliceNumbers(newPoliceCaseNumbers)
      } else {
        setHasError(true)
      }
      setClientPoliceNumbers(newPoliceCaseNumbers)
    },
    [clientPoliceNumbers, updatePoliceNumbers, setClientPoliceNumbers],
  )

  return (
    <>
      <SectionHeading title={formatMessage(m.heading)} required />
      <MultipleValueList
        name="policeCaseNumbers"
        inputMask="999-9999-9999999"
        inputLabel={formatMessage(m.label)}
        inputPlaceholder={formatMessage(m.placeholder, {
          prefix: user?.institution?.policeCaseNumberPrefix ?? '',
          year: new Date().getFullYear(),
        })}
        onAddValue={onAdd}
        buttonText={formatMessage(m.buttonText)}
        isDisabled={(value) =>
          !validate([[value, ['empty', 'police-casenumber-format']]]).isValid
        }
        onBlur={(event) => {
          setHasError(clientPoliceNumbers.length === 0 && !event.target.value)
        }}
        hasError={hasError}
        errorMessage={validate([[undefined, ['empty']]]).errorMessage}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          data-testid="policeCaseNumbers-list"
        >
          {clientPoliceNumbers.map((policeCaseNumber, index) => (
            <Box
              key={`${policeCaseNumber}-${index}`}
              paddingRight={1}
              paddingBottom={1}
            >
              <Tag
                variant="darkerBlue"
                onClick={onRemove(policeCaseNumber)}
                aria-label={formatMessage(m.removeNumber, { policeCaseNumber })}
              >
                <Box display="flex" alignItems="center">
                  <Box paddingRight={'smallGutter'}>{policeCaseNumber}</Box>
                  <Icon icon="close" size="small" />
                </Box>
              </Tag>
            </Box>
          ))}
        </Box>
      </MultipleValueList>
    </>
  )
}

export default PoliceCaseNumbers
