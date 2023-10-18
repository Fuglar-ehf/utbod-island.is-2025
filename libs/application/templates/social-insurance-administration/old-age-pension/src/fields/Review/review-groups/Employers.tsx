import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { EmployersTable } from '../../components/EmployersTable'

export const Employers = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [{ employers }] = useStatefulAnswers(application)
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('employers')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Label>
            {formatMessage(oldAgePensionFormMessage.employer.employerTitle)}
          </Label>
          {employers?.length > 0 && (
            <Box paddingTop={3}>
              <EmployersTable employers={employers} />
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
