import {
  Box,
  Bullet,
  BulletList,
  FocusableBox,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import * as styles from './Stakeholders.css'
import StackedTitleAndDescription from '../Stacked/Stacked'
import { CardSkeleton } from '../../../../components'
import { Case } from '../../../../types/interfaces'
import localization from '../../Case.json'
interface Props {
  chosenCase: Case
}

export const StakeholdersCard = ({ chosenCase }: Props) => {
  const [showStakeholders, setShowStakeholders] = useState<boolean>(false)
  const loc = localization['stakeholders']

  return (
    <FocusableBox
      onClick={() => setShowStakeholders(!showStakeholders)}
      display="block"
    >
      <CardSkeleton className={styles.relativeBox}>
        <StackedTitleAndDescription
          title={`${loc.title} (${chosenCase?.stakeholders?.length})`}
        >
          <FocusableBox
            component="button"
            onClick={() => setShowStakeholders(!showStakeholders)}
            className={styles.blowout}
          >
            <Icon
              icon={showStakeholders ? 'remove' : 'add'}
              type="outline"
              size="small"
              color="blue400"
            />
          </FocusableBox>
          {showStakeholders && (
            <>
              <Text>{loc.description}</Text>
              {chosenCase?.stakeholders.length < 1 && <Text>{loc.noList}</Text>}
              <Box padding="smallGutter">
                <BulletList type="ul">
                  {chosenCase?.stakeholders.map((stakeholder, index) => {
                    return <Bullet key={index}>{stakeholder.name}</Bullet>
                  })}
                </BulletList>
              </Box>
            </>
          )}
        </StackedTitleAndDescription>
      </CardSkeleton>
    </FocusableBox>
  )
}

export default StakeholdersCard
