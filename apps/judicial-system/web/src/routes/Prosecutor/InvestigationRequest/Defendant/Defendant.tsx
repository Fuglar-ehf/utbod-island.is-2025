import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type { Case } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system-web/src/utils/constants'

import DefendantForm from './DefendantForm'

const Defendant = () => {
  const router = useRouter()

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { createCase, isCreatingCase } = useCase()

  useEffect(() => {
    document.title = 'Rannsóknarheimild - Réttarvörslugátt'
  }, [])

  const handleNextButtonClick = async (theCase: Case) => {
    const caseId = theCase.id === '' ? await createCase(theCase) : theCase.id

    if (caseId) {
      router.push(`${constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${caseId}`)
    }

    // TODO: Handle creation error
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_ONE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
    >
      <DefendantForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        handleNextButtonClick={handleNextButtonClick}
        isLoading={isCreatingCase}
      />
    </PageLayout>
  )
}

export default Defendant
