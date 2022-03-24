import React, { FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { m } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { msg } from '../../../../../lib/messages'
import {
  Box,
  Button,
  Columns,
  Column,
  Input,
  Text,
  LoadingDots,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  useVerifySms,
  useUpdateOrCreateUserProfile,
  useDeleteIslykillValue,
} from '@island.is/service-portal/graphql'
import { sharedMessages } from '@island.is/shared/translations'
import { parseFullNumber } from '../../../../../utils/phoneHelper'
import * as styles from './ProfileForms.css'

interface Props {
  buttonText: string
  mobile?: string
  telDirty: (isDirty: boolean) => void
  disabled?: boolean
}

interface FormErrors {
  mobile: string | undefined
  code: string | undefined
}

export const InputPhone: FC<Props> = ({
  buttonText,
  mobile,
  disabled,
  telDirty,
}) => {
  useNamespaces('sp.settings')
  const { handleSubmit, control, errors, getValues, setValue } = useForm()
  const {
    updateOrCreateUserProfile,
    loading: saveLoading,
  } = useUpdateOrCreateUserProfile()
  const {
    deleteIslykillValue,
    loading: deleteLoading,
  } = useDeleteIslykillValue()
  const { formatMessage } = useLocale()
  const { createSmsVerification, createLoading } = useVerifySms()
  const [telInternal, setTelInternal] = useState(mobile)
  const [telToVerify, setTelToVerify] = useState(mobile)

  const [codeInternal, setCodeInternal] = useState('')

  const [inputPristine, setInputPristine] = useState(false)
  const [telVerifyCreated, setTelVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)

  const [resendBlock, setResendBlock] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    mobile: undefined,
    code: undefined,
  })

  useEffect(() => {
    if (resendBlock) {
      const timer = setTimeout(() => {
        setResendBlock(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [resendBlock])

  useEffect(() => {
    if (mobile && mobile.length > 0) {
      setTelInternal(mobile)
      setValue('tel', mobile, { shouldValidate: true })
    }
    checkSetPristineInput()
  }, [mobile])

  useEffect(() => {
    if (
      telInternal &&
      (mobile === telInternal || telInternal === telToVerify)
    ) {
      telDirty(false)
    } else {
      telDirty(true)
    }
    checkSetPristineInput()
  }, [telInternal, mobile])

  const handleSendTelVerification = async (data: { tel: string }) => {
    try {
      const telValue = data.tel ?? ''

      setResendBlock(true)

      const response = await createSmsVerification({
        mobilePhoneNumber: telValue,
      })

      if (response.data?.createSmsVerification?.created) {
        setTelVerifyCreated(true)
        setTelToVerify(telValue)
        setVerificationValid(false)
        setErrors({ ...formErrors, mobile: undefined })
      } else {
        setErrors({ ...formErrors, mobile: formatMessage(m.somethingWrong) })
      }
    } catch (err) {
      console.error(`createSmsVerification error: ${err}`)
      setResendBlock(false)
      setErrors({ ...formErrors, mobile: formatMessage(m.somethingWrong) })
    }
  }

  const handleConfirmCode = async (data: { code: string }) => {
    const codeError = formatMessage({
      id: 'sp.settings:code-service-error',
      defaultMessage: 'Villa í staðfestingu kóða. Vinsamlegast reynið aftur.',
    })
    try {
      const codeValue = data.code ?? ''
      const formValues = getValues()
      const telValue = formValues?.tel

      if (telValue === telToVerify) {
        await updateOrCreateUserProfile({
          mobilePhoneNumber: `+354-${telToVerify}`,
          smsCode: codeValue,
        }).then(() => {
          setInputPristine(true)
          setVerificationValid(true)
        })
      }
      setErrors({ ...formErrors, code: undefined })
    } catch (err) {
      console.error(`confirmSmsVerification error: ${err}`)
      setErrors({ ...formErrors, code: codeError })
    }
  }

  const saveEmptyChange = async () => {
    const emailError = formatMessage({
      id: 'sp.settings:email-service-error',
      defaultMessage:
        'Vandamál með tölvupóstþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      await deleteIslykillValue({
        mobilePhoneNumber: true,
      })

      setVerificationValid(true)
      setInputPristine(true)
      setErrors({ ...formErrors, code: undefined })
    } catch (err) {
      setErrors({ ...formErrors, code: emailError })
    }
  }

  const checkSetPristineInput = () => {
    if (getValues().tel === mobile) {
      setInputPristine(true)

      setTelVerifyCreated(false)
    } else {
      setInputPristine(false)
      setVerificationValid(false)
    }
  }

  return (
    <Box>
      <form
        onSubmit={handleSubmit(
          telInternal ? handleSendTelVerification : saveEmptyChange,
        )}
      >
        <Box display="flex" flexWrap="wrap" alignItems="center">
          <Box marginRight={3} width="full" className={styles.formContainer}>
            <Columns>
              <Column width="content">
                <Box className={styles.countryCodeInput}>
                  <Input
                    label={formatMessage({
                      id: 'sp.settings:phone-country-code',
                      defaultMessage: 'Landsnúmer',
                    })}
                    name="country-code"
                    backgroundColor="blue"
                    size="xs"
                    readOnly
                    value="+354"
                    disabled
                  />
                </Box>
              </Column>
              <Column>
                <InputController
                  control={control}
                  id="tel"
                  backgroundColor="blue"
                  name="tel"
                  type="tel"
                  format="### ####"
                  required={false}
                  icon={inputPristine ? 'checkmark' : undefined}
                  disabled={disabled}
                  size="xs"
                  rules={{
                    minLength: {
                      value: 7,
                      message: formatMessage(msg.errorTelReqLength),
                    },
                    maxLength: {
                      value: 7,
                      message: formatMessage(msg.errorTelReqLength),
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: formatMessage(msg.errorOnlyNumbers),
                    },
                  }}
                  label={formatMessage(sharedMessages.phoneNumber)}
                  placeholder="000 0000"
                  onChange={(inp) => {
                    setTelInternal(parseFullNumber(inp.target.value || ''))
                    setErrors({ ...formErrors, mobile: undefined })
                  }}
                  error={errors.tel?.message || formErrors.mobile}
                  defaultValue={mobile}
                />
              </Column>
            </Columns>
          </Box>
          <Box
            display="flex"
            alignItems="flexStart"
            flexDirection="column"
            paddingTop={2}
          >
            {!createLoading && !deleteLoading && (
              <>
                {telVerifyCreated ? (
                  <Button
                    variant="text"
                    disabled={
                      verificationValid ||
                      disabled ||
                      resendBlock ||
                      inputPristine
                    }
                    size="small"
                    onClick={
                      telInternal
                        ? () =>
                            handleSendTelVerification({
                              tel: getValues().tel,
                            })
                        : () => saveEmptyChange()
                    }
                  >
                    {telInternal
                      ? telInternal === telToVerify
                        ? formatMessage({
                            id: 'sp.settings:resend',
                            defaultMessage: 'Endursenda',
                          })
                        : buttonText
                      : formatMessage(msg.saveEmptyChange)}
                  </Button>
                ) : (
                  <button
                    type="submit"
                    disabled={verificationValid || disabled || inputPristine}
                  >
                    <Button
                      variant="text"
                      size="small"
                      disabled={verificationValid || disabled || inputPristine}
                    >
                      {telInternal
                        ? buttonText
                        : formatMessage(msg.saveEmptyChange)}
                    </Button>
                  </button>
                )}
              </>
            )}
            {(createLoading || deleteLoading) && <LoadingDots />}
          </Box>
        </Box>
      </form>
      {telVerifyCreated && !inputPristine && (
        <Box marginTop={3}>
          <Text variant="medium" marginBottom={2}>
            {formatMessage({
              id: 'sp.settings:tel-verify-code-sent',
              defaultMessage: `Öryggiskóði hefur verið sendur í símann þinn. Sláðu hann inn
                  hér að neðan.`,
            })}
          </Text>
          <form onSubmit={handleSubmit(handleConfirmCode)}>
            <Box display="flex" flexWrap="wrap" alignItems="flexStart">
              <Box className={styles.codeInput} marginRight={3}>
                <InputController
                  control={control}
                  backgroundColor="blue"
                  id="code"
                  name="code"
                  format="######"
                  label={formatMessage(m.verificationCode)}
                  placeholder="123456"
                  defaultValue=""
                  error={errors.code?.message || formErrors.code}
                  disabled={verificationValid || disabled}
                  icon={verificationValid ? 'checkmark' : undefined}
                  size="xs"
                  onChange={(inp) => {
                    setCodeInternal(inp.target.value)
                    setErrors({ ...formErrors, code: undefined })
                  }}
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage(m.verificationCodeRequired),
                    },
                  }}
                />
              </Box>
              <Box
                display="flex"
                alignItems="flexStart"
                flexDirection="column"
                paddingTop={4}
              >
                {!saveLoading && (
                  <button
                    type="submit"
                    disabled={!codeInternal || disabled || verificationValid}
                  >
                    <Button
                      variant="text"
                      size="small"
                      disabled={!codeInternal || disabled || verificationValid}
                    >
                      {formatMessage(m.codeConfirmation)}
                    </Button>
                  </button>
                )}
                {saveLoading && (
                  <Box>
                    <LoadingDots />
                  </Box>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  )
}
