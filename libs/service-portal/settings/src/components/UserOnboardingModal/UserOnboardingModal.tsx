import { toast } from '@island.is/island-ui/core'
import { defaultLanguage, Locale, useNamespaces } from '@island.is/localization'
import {
  Modal,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { useCreateUserProfile } from '@island.is/service-portal/graphql'
import React, { useState } from 'react'
import { EmailFormData } from '../Forms/EmailForm'
import { LanguageFormData, LanguageFormOption } from '../Forms/LanguageForm'
import { PhoneFormData } from '../Forms/PhoneForm/Steps/FormStep'
import { OnboardingStepper } from './OnboardingStepper'
import { EmailStep } from './Steps/EmailStep'
import { FormSubmittedStep } from './Steps/FormSubmittedStep'
import { LanguageStep } from './Steps/LanguageStep'
import { PhoneStep } from './Steps/PhoneStep'
import { SubmitFormStep } from './Steps/SubmitFormStep'

export type OnboardingStep =
  | 'language-form'
  | 'tel-form'
  | 'email-form'
  | 'submit-form'
  | 'form-submitted'

const defaultLanguageOption: LanguageFormOption = {
  value: 'is',
  label: 'Íslenska',
}

const UserOnboardingModal: ServicePortalModuleComponent = ({ userInfo }) => {
  const [toggleCloseModal, setToggleCloseModal] = useState(false)
  const [step, setStep] = useState<OnboardingStep>('language-form')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState<LanguageFormOption | null>(
    defaultLanguageOption,
  )
  const { createUserProfile } = useCreateUserProfile()
  const { changeLanguage } = useNamespaces()

  // On close side effects
  const dropOnboardingSideEffects = () => {
    toast.info('Notendaupplýsingum er hægt að breyta í stillingum')
  }

  // Handles a close event directly in the onboarding component
  const dropOnboarding = () => {
    setToggleCloseModal(true)
    dropOnboardingSideEffects()
  }

  const closeModal = () => {
    setToggleCloseModal(true)
  }

  const gotoStep = (step: OnboardingStep) => {
    setStep(step)
  }

  const submitFormData = async (
    email: string,
    mobilePhoneNumber: string,
    locale: Locale,
  ) => {
    gotoStep('submit-form')

    try {
      await createUserProfile({
        email,
        locale,
        mobilePhoneNumber,
      })
      gotoStep('form-submitted')
    } catch (err) {
      gotoStep('email-form')
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að uppfæra notendaupplýsingar þínar',
      )
    }
  }

  const handleLanguageStepSubmit = (data: LanguageFormData) => {
    if (data.language === null) return
    setLanguage(data.language)
    changeLanguage(data.language.value)
    gotoStep('tel-form')
  }

  const handlePhoneStepSubmit = (data: PhoneFormData) => {
    setTel(data.tel)
    gotoStep('email-form')
  }

  const handleEmailStepSubmit = (data: EmailFormData) => {
    setEmail(data.email)
    submitFormData(data.email, tel, language?.value || defaultLanguage)
  }

  return (
    <Modal
      id="user-onboarding-modal"
      onCloseModal={dropOnboardingSideEffects}
      toggleClose={toggleCloseModal}
    >
      <OnboardingStepper activeStep={step} />
      {step === 'language-form' && (
        <LanguageStep
          onClose={dropOnboarding}
          language={language}
          onSubmit={handleLanguageStepSubmit}
          userInfo={userInfo}
        />
      )}
      {step === 'tel-form' && (
        <PhoneStep
          onBack={gotoStep.bind(null, 'language-form')}
          natReg={userInfo.profile.nationalId}
          tel={tel}
          onSubmit={handlePhoneStepSubmit}
        />
      )}
      {step === 'email-form' && (
        <EmailStep
          onBack={gotoStep.bind(null, 'tel-form')}
          email={email}
          onSubmit={handleEmailStepSubmit}
        />
      )}
      {step === 'submit-form' && <SubmitFormStep />}
      {step === 'form-submitted' && <FormSubmittedStep onClose={closeModal} />}
    </Modal>
  )
}

export default UserOnboardingModal
