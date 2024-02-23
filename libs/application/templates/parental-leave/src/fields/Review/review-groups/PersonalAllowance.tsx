import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { NO, YES } from '../../../constants'
import { GridColumn, GridRow } from '@island.is/island-ui/core'

export const PersonalAllowance = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { usePersonalAllowance, personalUseAsMuchAsPossible, personalUsage } =
    getApplicationAnswers(application.answers)
  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('personalAllowance')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <RadioValue
            label={formatMessage(
              parentalLeaveFormMessages.personalAllowance.title,
            )}
            value={usePersonalAllowance}
          />
        </GridColumn>

        {usePersonalAllowance === YES && personalUseAsMuchAsPossible === YES && (
          <GridColumn
            paddingTop={[2, 2, 2, 0]}
            span={['12/12', '12/12', '12/12', '5/12']}
          >
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.reviewScreen.usePersonalAllowance,
              )}
              value={personalUseAsMuchAsPossible}
            />
          </GridColumn>
        )}

        {usePersonalAllowance === YES && personalUseAsMuchAsPossible === NO && (
          <GridColumn
            paddingTop={[2, 2, 2, 0]}
            span={['12/12', '12/12', '12/12', '5/12']}
          >
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.personalAllowance.allowanceUsage,
              )}
              value={`${personalUsage ?? 0}%`}
            />
          </GridColumn>
        )}
      </GridRow>
    </ReviewGroup>
  )
}
