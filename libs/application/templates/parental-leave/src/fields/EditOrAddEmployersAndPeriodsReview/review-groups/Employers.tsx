import React, { FC } from 'react'
import { Application } from '@island.is/application/types'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { ReviewGroup, Label } from '@island.is/application/ui-components'
import { EmployersTable } from '../../components/EmployersTable'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'
import {
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  YES,
} from '../../../constants'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Employers: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const {
    employers,
    addEmployer,
    tempEmployers,
    applicationType,
    isReceivingUnemploymentBenefits,
    isSelfEmployed,
    employerLastSixMonths,
  } = getApplicationAnswers(application.answers)

  const employersArray = addEmployer === YES ? employers : tempEmployers

  const hasEmployer =
    (applicationType === PARENTAL_LEAVE &&
      isReceivingUnemploymentBenefits !== YES &&
      isSelfEmployed !== YES) ||
    ((applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
      employerLastSixMonths === YES)

  return (
    hasEmployer &&
    employers.length !== 0 && (
      <ReviewGroup isEditable editAction={() => goToScreen?.('addEmployer')}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Label>
              {formatMessage(parentalLeaveFormMessages.employer.title)}
            </Label>
            {employersArray?.length > 0 && (
              <Box paddingTop={3}>
                <EmployersTable employers={employersArray} />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    )
  )
}

export default Employers
