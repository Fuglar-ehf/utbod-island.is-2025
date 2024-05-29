import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  IndictmentCaseReviewDecision,
  isPublicProsecutor,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  Modal,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './ReviewDecision.strings'
import * as styles from './ReviewDecision.css'

interface Props {
  caseId: string
  indictmentAppealDeadline?: string
  modalVisible?: boolean
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  onSelect?: () => void
}

export const ReviewDecision: React.FC<Props> = (props) => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { updateCase } = useCase()

  const {
    caseId,
    indictmentAppealDeadline,
    modalVisible,
    setModalVisible,
    onSelect,
  } = props

  const [indictmentReviewDecision, setIndictmentReviewDecision] = useState<
    IndictmentCaseReviewDecision | undefined
  >(undefined)

  const handleReviewDecision = async () => {
    if (!indictmentReviewDecision) {
      return
    }
    const updateSuccess = await updateCase(caseId, {
      indictmentReviewDecision: indictmentReviewDecision,
    })
    if (updateSuccess) {
      router.push(constants.CASES_ROUTE)
    }
  }

  const options = [
    {
      label: fm(strings.appealToCourtOfAppeals),
      value: IndictmentCaseReviewDecision.APPEAL,
    },
    {
      label: fm(strings.acceptDecision),
      value: IndictmentCaseReviewDecision.ACCEPT,
    },
  ]

  if (!isPublicProsecutor(user)) {
    return null
  }

  return (
    <Box marginBottom={5}>
      <SectionHeading
        title={fm(strings.title)}
        description={
          <Text variant="eyebrow">
            {fm(strings.subtitle, {
              indictmentAppealDeadline: formatDate(
                indictmentAppealDeadline,
                'P',
              ),
            })}
          </Text>
        }
      />
      <BlueBox>
        <div className={styles.gridRow}>
          {options.map((item, index) => {
            return (
              <RadioButton
                name={`reviewOption-${index}`}
                label={item.label}
                value={item.value}
                checked={indictmentReviewDecision === item.value}
                onChange={() => {
                  onSelect && onSelect()
                  setIndictmentReviewDecision(item.value)
                }}
                backgroundColor="white"
                large
              />
            )
          })}
        </div>
      </BlueBox>
      {modalVisible && (
        <Modal
          title={fm(strings.reviewModalTitle)}
          text={fm(strings.reviewModalText, {
            reviewerDecision: indictmentReviewDecision,
          })}
          primaryButtonText={fm(strings.reviewModalPrimaryButtonText)}
          secondaryButtonText={fm(strings.reviewModalSecondaryButtonText)}
          onClose={() => setModalVisible(false)}
          onPrimaryButtonClick={handleReviewDecision}
          onSecondaryButtonClick={() => setModalVisible(false)}
        />
      )}
    </Box>
  )
}
