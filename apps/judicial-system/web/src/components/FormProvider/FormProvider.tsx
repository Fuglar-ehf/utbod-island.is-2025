import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'

import { CaseData } from '../../types'

type ProviderState =
  | 'fetch'
  | 'refresh'
  | 'up-to-date'
  | 'ready'
  | 'not-found'
  | undefined

interface FormProvider {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoadingWorkingCase: boolean
  caseNotFound: boolean
  isCaseUpToDate: boolean
}

interface Props {
  children: ReactNode
}

const initialState: Case = {
  id: '',
  created: '',
  modified: '',
  type: CaseType.CUSTODY,
  state: CaseState.NEW,
  policeCaseNumber: '',
  accusedNationalId: '',
}

export const FormContext = createContext<FormProvider>({
  workingCase: initialState,
  setWorkingCase: () => initialState,
  isLoadingWorkingCase: true,
  caseNotFound: false,
  isCaseUpToDate: false,
})

const FormProvider = ({ children }: Props) => {
  const router = useRouter()
  const id = router.query.id
  const caseType = router.pathname.includes('farbann')
    ? CaseType.TRAVEL_BAN
    : router.pathname.includes('gaesluvardhald')
    ? CaseType.CUSTODY
    : // This is just a random investigation case type for the default value. This
      // is updated when the case is created.
      CaseType.OTHER

  const [state, setState] = useState<ProviderState>()
  const [caseId, setCaseId] = useState<string>()
  const [path, setPath] = useState<string>()

  const [workingCase, setWorkingCase] = useState<Case>({
    ...initialState,
    type: caseType,
  })

  // Used in exported indicators
  const replacingCase = router.query.id && router.query.id !== caseId
  const replacingPath = router.pathname !== path

  useEffect(() => {
    if (!router.query.id) {
      // Not working on a case
      setState(undefined)
    } else if (router.query.id === caseId) {
      // Working on the same case as the previous page
      setState('refresh')
    } else {
      // Starting work on a different case
      setState('fetch')
    }

    setCaseId(router.query.id as string)
    setPath(router.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id, router.pathname])

  const [getCase] = useLazyQuery<CaseData>(CaseQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (caseData) => {
      if (caseData?.case) {
        setWorkingCase(caseData.case)

        // The case has been loaded from the server
        setState('up-to-date')
      }
    },
    onError: () => {
      // The case was not found
      setState('not-found')
    },
  })

  useEffect(() => {
    if (state === 'fetch' || state === 'refresh') {
      getCase({ variables: { input: { id } } })
    }
  }, [getCase, id, state])

  useEffect(() => {
    if (state === 'up-to-date') {
      // The case may change on the server so we only stay up to date for a short time
      // The time needs to be long enough to let hooks take appropriate actions, for instance auto fill
      setTimeout(() => setState('ready'), 1000)
    }
  }, [state])

  return (
    <FormContext.Provider
      value={{
        workingCase,
        setWorkingCase,
        // Loading when we have just switched cases or we are still fetching
        isLoadingWorkingCase: replacingCase || state === 'fetch',
        // Not found until we navigate to a different page
        caseNotFound: !replacingPath && state === 'not-found',
        isCaseUpToDate: state === 'up-to-date',
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
