import React, { useEffect, useState, useCallback } from 'react'
import { Text, Icon, Box, Checkbox } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
  LogoHfj,
} from '@island.is/financial-aid-web/osk/src/components'
import * as styles from './info.treat'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'

import { NavigationProps } from '@island.is/financial-aid/shared'

const ApplicationInfo = () => {
  const router = useRouter()

  const [accept, setAccept] = useState(false)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <FormLayout activeSection={navigation?.activeSectionIndex}>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
          Gagnaöflun
        </Text>

        <Box className={styles.textIconContainer} marginBottom={3}>
          <Icon
            color="blue400"
            icon="fileTrayFull"
            size="large"
            type="outline"
          />

          <Text as="h2" variant="h4">
            Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.
          </Text>
        </Box>

        <Text marginBottom={2}>
          Við þurfum að fá þig til að renna yfir nokkur atriði og gefa
          upplýsingar um búsetu og laun yfir síðustu 2 mánuði, ef einhver, til
          að reikna út aðstoð til útgreiðslu í byrjun apríl.
        </Text>
        <Text marginBottom={3}>
          Í lokin velurðu að senda inn umsóknina eða eyða henni og öllum tengdum
          gögnum.
        </Text>

        <Text as="h3" variant="h5" color="blue400">
          Upplýsingar um styrki og bætur
        </Text>
        <Text marginBottom={2}>
          T.a.m. hjá Vinnumálastofnun, Sjúkratryggingum Íslands, o.fl.
        </Text>

        <Text as="h3" variant="h5" color="blue400">
          Upplýsingar um stöðu og eignir
        </Text>
        <Text marginBottom={[4, 4, 5]}>T.a.m. hjá þjóðskrá og Skattinum.</Text>

        <Box marginBottom={[5, 5, 10]} cursor="pointer">
          <Checkbox
            name={'accept'}
            backgroundColor="blue"
            label="Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu"
            large
            checked={accept}
            onChange={(event) => {
              if (error) {
                setError(false)
              }
              setAccept(event.target.checked)
            }}
            hasError={error}
            errorMessage={'Þú þarft að samþykkja gagnaöflun'}
          />
        </Box>

        <Box
          className={styles.logoContainer}
          alignItems="center"
          justifyContent="center"
          marginBottom={5}
        >
          <LogoHfj className={styles.logo} />
        </Box>
      </FormContentContainer>

      <FormFooter
        previousIsDestructive={true}
        nextButtonText="Staðfesta"
        nextButtonIcon="checkmark"
        onNextButtonClick={() => {
          if (!accept) {
            setError(true)
          } else {
            router.push(navigation?.nextUrl ?? '/')
          }
        }}
      />
    </FormLayout>
  )
}

export default ApplicationInfo
