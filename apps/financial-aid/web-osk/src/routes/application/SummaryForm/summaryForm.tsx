import React, { useState, useContext } from 'react'
import { Text, Divider, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  FormLayout,
  CancelModal,
  Estimation,
  UserInfo,
  AllFiles,
  FormInfo,
  FormComment,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { useRouter } from 'next/router'

import * as styles from './summaryForm.treat'
import cn from 'classnames'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared/lib'

import useApplication from '@island.is/financial-aid-web/osk/src/utils/useApplication'

import {
  Employment,
  getEmploymentStatus,
  getHomeCircumstances,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'

const SummaryForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const { user } = useContext(UserContext)

  const [isVisible, setIsVisible] = useState(false)

  const [formError, setFormError] = useState({
    status: false,
    message: '',
  })

  const { createApplication } = useApplication()

  const formInfoOverview = [
    {
      id: 'homeCircumstances',
      label: 'Búseta',
      url: 'buseta',
      info:
        form?.homeCircumstances === HomeCircumstances.OTHER
          ? form?.homeCircumstancesCustom
          : getHomeCircumstances[form?.homeCircumstances as HomeCircumstances],
    },
    {
      id: 'hasIncome',
      label: 'Tekjur',
      url: 'tekjur',
      info:
        form?.hasIncome === undefined
          ? undefined
          : 'Ég hef ' +
            (form?.hasIncome ? '' : 'ekki') +
            'fengið tekjur í þessum mánuði eða síðasta',
    },
    {
      id: 'employmentCustom',
      label: 'Staða',
      url: 'atvinna',
      info: form?.employmentCustom
        ? form?.employmentCustom
        : getEmploymentStatus[form?.employment as Employment],
    },
    {
      id: 'emailAddress',
      label: 'Netfang',
      url: 'samskipti',
      info: form?.emailAddress,
    },
  ]

  const handleNextButtonClick = async () => {
    if (!form || !user) {
      return
    }

    await createApplication(form, user, updateForm)
      .then((res) => {
        if (navigation?.nextUrl) {
          router.push(navigation.nextUrl)
        }
      })
      .catch((e) => {
        setFormError({
          status: true,
          message: 'Obbobbob einhvað fór úrskeiðis',
        })

        if (e.networkError.statusCode === 400) {
          const findErrorInFormInfo = formInfoOverview.find(
            (el) => el.info === undefined,
          )

          if (findErrorInFormInfo) {
            var element = document.getElementById(findErrorInFormInfo.id)
            element?.scrollIntoView({
              behavior: 'smooth',
            })
          }
        }
      })
  }

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 4]}>
          Yfirlit umsóknar
        </Text>

        <Estimation
          usePersonalTaxCredit={form.usePersonalTaxCredit}
          homeCircumstances={form.homeCircumstances}
          aboutText={
            <Text marginBottom={[2, 2, 3]}>
              Athugaðu að þessi útreikningur er eingöngu til viðmiðunar og{' '}
              <span className={styles.taxReturn}>
                gerir ekki ráð fyrir tekjum eða gögnum úr skattframtali
              </span>{' '}
              sem geta haft áhrif á þína aðstoð. Þú færð skilaboð þegar frekari
              útreikningur liggur fyrir.
            </Text>
          }
        />

        <Box marginTop={[4, 4, 5]}>
          <Divider />
        </Box>

        <UserInfo />

        <FormInfo info={formInfoOverview} error={formError.status} />

        <Divider />

        <AllFiles />

        <FormComment />

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]: formError.status,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            {formError.message}
          </Text>
        </div>

        <CancelModal
          isVisible={isVisible}
          setIsVisible={(isVisibleBoolean) => {
            setIsVisible(isVisibleBoolean)
          }}
        />
      </ContentContainer>

      <Footer
        onPrevButtonClick={() => {
          setIsVisible(!isVisible)
        }}
        previousIsDestructive={true}
        prevButtonText="Hætta við"
        nextButtonText="Senda umsókn"
        onNextButtonClick={handleNextButtonClick}
      />
    </FormLayout>
  )
}

export default SummaryForm
