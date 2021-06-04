import { motion } from 'framer-motion'
import React from 'react'
import InfoBox from '@island.is/judicial-system-web/src/shared-components/InfoBox/InfoBox'
import { formatDate } from '@island.is/judicial-system/formatters'

interface Props {
  prosecutorPostponedAppealDate?: string
  withdrawProsecutorAppealDate?: () => void
}

const ProsecutorInfo: React.FC<Props> = (props) => {
  const { prosecutorPostponedAppealDate, withdrawProsecutorAppealDate } = props

  const animateInAndOut = {
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.4 } },
    hidden: { y: 20, opacity: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      key="prosecutorAppealInfoBox"
      variants={animateInAndOut}
      initial={{ y: 20, opacity: 0 }}
      exit="hidden"
      animate="visible"
    >
      <InfoBox
        text={`Sækjandi hefur kært úrskurðinn ${formatDate(
          prosecutorPostponedAppealDate,
          'PPPp',
        )}`}
        onDismiss={withdrawProsecutorAppealDate}
        fluid
        light
      />
    </motion.div>
  )
}

export default ProsecutorInfo
