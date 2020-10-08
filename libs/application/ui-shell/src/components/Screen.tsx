import React, { FC, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import {
  ExternalData,
  FieldBaseProps,
  FormItemTypes,
  FormMode,
  FormValue,
  Schema,
} from '@island.is/application/core'
import { Box, Button, GridColumn, Typography } from '@island.is/island-ui/core'
import {
  SUBMIT_APPLICATION,
  UPDATE_APPLICATION,
} from '@island.is/application/graphql'
import deepmerge from 'deepmerge'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FormModes, FormScreen, ResolverContext } from '../types'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'
import FormRepeater from './FormRepeater'
import FormExternalDataProvider from './FormExternalDataProvider'
import { findReviewField, verifyExternalData } from '../utils'

import * as styles from './Screen.treat'
import { useLocale } from '@island.is/localization'

type ScreenProps = {
  answerAndGoToNextScreen(answers: FormValue): void
  formValue: FormValue
  addExternalData(data: ExternalData): void
  answerQuestions(answers: FormValue): void
  dataSchema: Schema
  externalData: ExternalData
  shouldSubmit?: boolean
  isLastScreen?: boolean
  expandRepeater(): void
  prevScreen(): void
  screen: FormScreen
  mode?: FormMode
  applicationId: string
}

const Screen: FC<ScreenProps> = ({
  formValue,
  addExternalData,
  answerQuestions,
  dataSchema,
  expandRepeater,
  externalData,
  answerAndGoToNextScreen,
  prevScreen,
  shouldSubmit = false,
  isLastScreen = false,
  screen,
  mode,
  applicationId,
}) => {
  const { formatMessage } = useLocale()
  const hookFormData = useForm<FormValue, ResolverContext>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: formValue,
    shouldUnregister: false,
    resolver,
    context: { dataSchema, formNode: screen },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
  )
  const { handleSubmit, errors, reset } = hookFormData

  const goBack = useCallback(() => {
    // using deepmerge to prevent some weird react-hook-form read-only bugs
    reset(deepmerge({}, formValue))
    prevScreen()
  }, [formValue, prevScreen, reset])

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    if (shouldSubmit) {
      const finalAnswers = { ...formValue, ...data }
      const reviewField = findReviewField(screen)

      const event = reviewField
        ? finalAnswers[reviewField.id] ?? 'SUBMIT'
        : 'SUBMIT'
      await submitApplication({
        variables: {
          input: {
            id: applicationId,
            event,
            answers: finalAnswers,
          },
        },
      })
    } else {
      await updateApplication({
        variables: {
          input: {
            id: applicationId,
            answers: data,
          },
        },
      })
    }
    answerAndGoToNextScreen(data)
  }

  function canProceed(): boolean {
    const isLoadingOrPending = loading || loadingSubmit
    if (screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER) {
      return (
        !isLoadingOrPending &&
        verifyExternalData(externalData, screen.dataProviders)
      )
    }
    return !isLoadingOrPending
  }

  return (
    <FormProvider {...hookFormData}>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        key={screen.id}
        height="full"
        onSubmit={handleSubmit(onSubmit)}
        style={{ minHeight: '65vh' }}
      >
        <GridColumn
          span={['12/12', '12/12', '7/9', '7/9']}
          offset={['0', '0', '1/9']}
        >
          <Typography variant="h2">{formatMessage(screen.name)}</Typography>
          <Box>
            {screen.type === FormItemTypes.REPEATER ? (
              <FormRepeater
                errors={errors}
                expandRepeater={expandRepeater}
                repeater={screen}
                formValue={formValue}
                externalData={externalData}
              />
            ) : screen.type === FormItemTypes.MULTI_FIELD ? (
              <FormMultiField
                answerQuestions={answerQuestions}
                errors={errors}
                multiField={screen}
                formValue={formValue}
                applicationId={applicationId}
              />
            ) : screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER ? (
              <FormExternalDataProvider
                addExternalData={addExternalData}
                applicationId={applicationId}
                externalData={externalData}
                externalDataProvider={screen}
                formValue={formValue}
              />
            ) : (
              <FormField
                autoFocus
                errors={errors}
                field={screen}
                formValue={formValue}
                applicationId={applicationId}
              />
            )}
          </Box>
        </GridColumn>
        {!isLastScreen &&
          (mode === FormModes.REVIEW || mode === FormModes.APPLYING) && (
            <Box marginTop={3} className={styles.buttonContainer}>
              <GridColumn
                span={['12/12', '12/12', '7/9', '7/9']}
                offset={['0', '0', '1/9']}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="spaceBetween"
                  paddingTop={[1, 4]}
                  paddingBottom={[1, 5]}
                >
                  <Box
                    display={['none', 'inlineFlex']}
                    padding={2}
                    paddingLeft="none"
                  >
                    <Button variant="ghost" onClick={goBack}>
                      {formatMessage({
                        id: 'application.system:button.back',
                        defaultMessage: 'Til baka',
                        description: 'Back button text',
                      })}
                    </Button>
                  </Box>
                  <Box
                    display={['inlineFlex', 'none']}
                    padding={2}
                    paddingLeft="none"
                  >
                    <Button
                      variant="ghost"
                      rounded={true}
                      icon="arrowLeft"
                      onClick={goBack}
                    />
                  </Box>
                  <Box display="inlineFlex" padding={2} paddingRight="none">
                    {shouldSubmit ? (
                      <Button
                        loading={loading}
                        disabled={!canProceed()}
                        htmlType="submit"
                      >
                        {formatMessage({
                          id: 'application.system:button.submit',
                          defaultMessage: 'Submit',
                          description: 'Submit button text',
                        })}
                      </Button>
                    ) : (
                      <>
                        <Box display={['none', 'inlineFlex']}>
                          <Button
                            loading={loading}
                            disabled={!canProceed()}
                            icon="arrowRight"
                            htmlType="submit"
                          >
                            {formatMessage({
                              id: 'application.system:button.next',
                              defaultMessage: 'Halda áfram',
                              description: 'Next button text',
                            })}
                          </Button>
                        </Box>
                        <Box display={['inlineFlex', 'none']}>
                          <Button
                            loading={loading}
                            disabled={!canProceed()}
                            icon="arrowRight"
                            htmlType="submit"
                            rounded
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              </GridColumn>
            </Box>
          )}
      </Box>
    </FormProvider>
  )
}

export default Screen
