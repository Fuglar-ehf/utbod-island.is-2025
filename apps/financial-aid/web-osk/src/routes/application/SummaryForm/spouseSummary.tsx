import React, { useState, useContext } from 'react'
import { Text, Divider, Box } from '@island.is/island-ui/core'

import {
  ContentContainer,
  Footer,
  CancelModal,
  UserInfo,
  AllFiles,
  FormInfo,
  FormComment,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import cn from 'classnames'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import { FileType, NavigationProps } from '@island.is/financial-aid/shared/lib'

import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import useUpdateApplication from '@island.is/financial-aid-web/osk/src/utils/hooks/useUpdateApplication'

const SpouseSummary = () => {
  const router = useRouter()
  const { form } = useContext(FormContext)

  const { user } = useContext(AppContext)

  const { updateApplication } = useUpdateApplication()

  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formError, setFormError] = useState({
    status: false,
    message: '',
  })

  const formInfoOverview = [
    {
      id: 'hasIncome',
      label: 'Tekjur',
      url: 'tekjur',
      info:
        form?.hasIncome === undefined
          ? undefined
          : 'Ég hef ' +
            (form.hasIncome ? '' : 'ekki') +
            'fengið tekjur í þessum mánuði eða síðasta',
    },
    {
      id: 'emailAddress',
      label: 'Netfang',
      url: 'samskipti',
      info: form.emailAddress,
    },
  ]

  const handleNextButtonClick = async () => {
    if (!form || !user) {
      return
    }

    setIsLoading(true)

    await updateApplication(
      user.currentApplicationId as string,
      FileType.SPOUSEFILES,
    )
      .then(() => {
        setIsLoading(false)
        if (navigation?.nextUrl) {
          router.push(navigation.nextUrl)
        }
      })
      .catch((e) => {
        setIsLoading(false)
        setFormError({
          status: true,
          message: 'Obbobbob einhvað fór úrskeiðis',
        })
      })
  }

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Yfirlit umsóknar
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar
          upplýsingar hafi verið gefnar upp.
        </Text>

        <Box marginTop={[4, 4, 5]}>
          <Divider />
        </Box>

        <UserInfo phoneNumber={form?.phoneNumber} />

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
          setIsVisible={(isModalVisible) => {
            setIsVisible(isModalVisible)
          }}
        />
      </ContentContainer>

      <Footer
        onPrevButtonClick={() => {
          setIsVisible((isVisible) => !isVisible)
        }}
        previousIsDestructive={true}
        prevButtonText="Hætta við"
        nextIsLoading={isLoading}
        nextButtonText={'Senda umsókn'}
        onNextButtonClick={handleNextButtonClick}
      />
    </>
  )
}

export default SpouseSummary
