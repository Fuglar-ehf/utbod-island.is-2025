import React from 'react'
import { AnimatePresence } from 'framer-motion'

import {
  ConclusionDraft,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import type { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isDraftingConclusion: boolean | undefined
  setIsDraftingConclusion: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >
}

const DraftConclusionModal: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    isDraftingConclusion,
    setIsDraftingConclusion,
  } = props

  return (
    <AnimatePresence>
      {isDraftingConclusion && (
        <Modal
          title="Skrifa drög að niðurstöðu"
          text={
            <ConclusionDraft
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          }
          primaryButtonText="Loka glugga"
          onPrimaryButtonClick={() => setIsDraftingConclusion(false)}
        />
      )}
    </AnimatePresence>
  )
}

export default DraftConclusionModal
