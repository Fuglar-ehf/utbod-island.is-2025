import { Application, Field, RecordObject } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import get from 'lodash/get'
import has from 'lodash/has'

import { BaseInformation } from './review-groups/BaseInformation'
import { Period } from './review-groups/Period'
import { Comment } from './review-groups/Comment'
import { Attachments } from './review-groups/Attachments'
import { ResidenceHistory } from './review-groups/ResidenceHistory'
import { ConnectedApplications } from './review-groups/ConnectedApplications'
import { Employers } from './review-groups/Employers'
import { PaymentInformation } from './review-groups/PaymentInformation'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/oldAgePensionUtils'
import { ApplicationType, Employment, YES, States } from '../../lib/constants'
import { RadioValue, ReviewGroup, handleServerError } from '@island.is/application/ui-components'
import { OnePaymentPerYear } from './review-groups/OnePaymentPerYear'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  refetch?: () => void
  errors?: RecordObject
  editable?: boolean
}

export const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
  refetch,
  errors,
}) => {
  const editable = field.props?.editable ?? false
  const { formatMessage } = useLocale()
  const {
    employmentStatus,
    applicationType,
    connectedApplications,
  } = getApplicationAnswers(application.answers)
  const { state } = application

  const hasError = (id: string) => get(errors, id) as string

  const groupHasNoErrors = (ids: string[]) =>
    ids.every((id) => !has(errors, id))

  const childProps = {
    application,
    editable,
    groupHasNoErrors,
    hasError,
    goToScreen,
  }

  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )

  const handleSubmit = useCallback(async (event: string) => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event,
          answers: application.answers,
        },
      },
    })

    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }, [])

  // TODO: Hvaða states eiga sjá þetta? Mega öll state sjá nema DRAFT og PREREQUISITES???rt------'hb
  const canView =
    state === States.TRYGGINGASTOFNUN_SUBMITTED ||
    state === States.TRYGGINGASTOFNUN_IN_REVIEW ||
    state === States.APPROVED ||
    state === States.REJECTED

  return (
    <>
      {state === `${States.DRAFT}` && (
        <Box>
          <Box marginBottom={2}>
            <Text variant="h2">
              {formatMessage(
                oldAgePensionFormMessage.review.confirmSectionTitle,
              )}
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Text variant="default">
              {formatMessage(
                oldAgePensionFormMessage.review.confirmationDescription,
              )}
            </Text>
          </Box>
        </Box>
      )}

      {canView && (
        <Box
          display={['block', 'block', 'block', 'flex']}
          justifyContent="spaceBetween"
        >
          <Box marginBottom={2}>
            <Text variant="h2">
              {formatMessage(oldAgePensionFormMessage.review.overviewTitle)}
            </Text>
          </Box>

          {state === `${States.TRYGGINGASTOFNUN_SUBMITTED}` && (
            <Box>
              <Button
                colorScheme="default"
                iconType="filled"
                size="small"
                type="button"
                variant="text"
                icon="pencil"
                loading={loadingSubmit}
                disabled={loadingSubmit}
                onClick={() => handleSubmit('EDIT')}
              >
                {formatMessage(oldAgePensionFormMessage.review.buttonsEdit)}
              </Button>
            </Box>
          )}
        </Box>
      )}
      <BaseInformation {...childProps} />
      <PaymentInformation {...childProps} />
      <ResidenceHistory {...childProps} />
      {employmentStatus === Employment.EMPLOYEE && (
        <Employers {...childProps} />
      )}
      <Period {...childProps} />
      {applicationType === ApplicationType.SAILOR_PENSION && (
        <ReviewGroup>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <RadioValue
                label={formatMessage(oldAgePensionFormMessage.review.fishermen)}
                value={YES}
              />
            </GridColumn>
          </GridRow>
        </ReviewGroup>
      )}
      <OnePaymentPerYear {...childProps} />
      {connectedApplications.length > 0 && (
        <ConnectedApplications {...childProps} />
      )}
      <Comment {...childProps} />
      <Attachments {...childProps} />
    </>
  )
}
