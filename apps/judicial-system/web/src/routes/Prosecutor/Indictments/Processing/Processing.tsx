import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import {
  FormContentContainer,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  processing as m,
} from '@island.is/judicial-system-web/messages'
import { Box, Tag, Text } from '@island.is/island-ui/core'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { Institution, User, UserRole } from '@island.is/judicial-system/types'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import CommentsInput from '@island.is/judicial-system-web/src/components/CommentsInput/CommentsInput'
import { isProcessingStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'
import * as constants from '@island.is/judicial-system/consts'

import SelectProsecutor from '../../SharedComponents/SelectProsecutor/SelectProsecutor'
import SelectCourt from '../../SharedComponents/SelectCourt/SelectCourt'
import PoliceCaseNumbersTags from '../../SharedComponents/PoliceCaseNumbersTags/PoliceCaseNumbersTags'

const Processing: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { setAndSendToServer } = useCase()
  const { formatMessage } = useIntl()
  const { courts } = useInstitution()
  const { data: userData } = useQuery<{ users: User[] }>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [prosecutors, setProsecutors] = useState<User[]>()

  useEffect(() => {
    if (userData?.users && workingCase) {
      setProsecutors(
        userData.users.filter(
          (aUser: User) =>
            aUser.role === UserRole.PROSECUTOR &&
            (!workingCase.creatingProsecutor ||
              aUser.institution?.id ===
                workingCase.creatingProsecutor?.institution?.id),
        ),
      )
    }
  }, [userData, workingCase, workingCase?.creatingProsecutor?.institution?.id])

  const setProsecutor = async (prosecutor: User) => {
    if (workingCase) {
      return setAndSendToServer(
        [
          {
            prosecutorId: prosecutor.id,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }

  const handleProsecutorChange = (prosecutor: User) => {
    if (!workingCase) {
      return false
    }

    setProsecutor(prosecutor)

    return true
  }

  const handleCourtChange = (court: Institution) => {
    if (workingCase) {
      setAndSendToServer(
        [
          {
            courtId: court.id,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      return true
    }

    return false
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={IndictmentsProsecutorSubsections.PROCESSING}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.processing)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <PoliceCaseNumbersTags
          policeCaseNumbers={workingCase.policeCaseNumbers}
        />
        <Box component="section" marginBottom={5}>
          <SelectProsecutor
            workingCase={workingCase}
            prosecutors={prosecutors || []}
            onChange={handleProsecutorChange}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SelectCourt
            workingCase={workingCase}
            courts={courts}
            onChange={handleCourtChange}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <CommentsInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_DEFENDANT_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isProcessingStepValidIndictments(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Processing
