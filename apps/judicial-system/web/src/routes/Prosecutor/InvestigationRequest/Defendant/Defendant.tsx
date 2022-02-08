import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'
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
  const { updateDefendant, createDefendant } = useDefendants()

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
    if (!theCase.id) {
      const createdCase = await createCase(theCase)

      workingCase.defendants?.forEach(async (defendant, index) => {
        if (index === 0) {
          await updateDefendant(createdCase.id, createdCase.defendants[0].id, {
            gender: defendant.gender,
            name: defendant.name,
            address: defendant.address,
            nationalId: defendant.nationalId,
          })
        } else {
          await createDefendant(createdCase.id, {
            gender: defendant.gender,
            name: defendant.name,
            address: defendant.address,
            nationalId: defendant.nationalId,
          })
        }
      })
      router.push(
        `${constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${createdCase.id}`,
      )
    } else {
      router.push(`${constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${theCase.id}`)
    }
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
