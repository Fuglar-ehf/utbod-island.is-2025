import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { rcDemands } from '@island.is/judicial-system-web/messages/RestrictionCases/Prosecutor/demandsForm'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'
import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'

import StepThreeForm from './StepThreeForm'

export const StepThree: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { autofill } = useCase()
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (
      workingCase.requestedCustodyRestrictions &&
      workingCase.requestedCustodyRestrictions.indexOf(
        CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
      ) > -1 &&
      workingCase.defendants
    ) {
      autofill(
        'requestedOtherRestrictions',
        formatMessage(
          rcDemands.sections.custodyRestrictions
            .requestedOtherRestrictionsAutofill,
          { gender: workingCase.defendants[0].gender },
        ),
        workingCase,
      )
    }
  }, [autofill, formatMessage, workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_THREE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.policeDemands)}
      />
      <StepThreeForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        user={user}
      />
    </PageLayout>
  )
}

export default StepThree
