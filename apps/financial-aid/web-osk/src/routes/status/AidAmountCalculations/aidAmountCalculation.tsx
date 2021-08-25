import React, { useContext } from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  Estimation,
  ContentContainer,
  Footer,
  StatusLayout,
} from '@island.is/financial-aid-web/osk/src/components'

import * as styles from './aidAmountCalculation.treat'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

const AidAmountCalculations = () => {
  const { user } = useContext(UserContext)

  return (
    <StatusLayout>
      <ContentContainer>
        {user?.currentApplication && (
          <Estimation
            homeCircumstances={user.currentApplication.homeCircumstances}
            usePersonalTaxCredit={user.currentApplication.usePersonalTaxCredit}
            aboutText={
              <Text marginBottom={[2, 2, 3]}>
                Athugaðu að þessi útreikningur er{' '}
                <span className={styles.taxReturn}>
                  eingöngu til viðmiðunar og getur tekið breytingum.
                </span>{' '}
                Þú færð skilaboð þegar frekari útreikningur liggur fyrir.
                Niðurstaða umsóknar þinnar ætti að liggja fyrir innan X virkra
                daga.
              </Text>
            }
          />
        )}
      </ContentContainer>
      <Footer previousUrl="/stada" hideNextButton={true} />
    </StatusLayout>
  )
}

export default AidAmountCalculations
