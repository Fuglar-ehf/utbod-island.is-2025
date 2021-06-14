import React, { useEffect, useState, useContext } from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
  RadioButtonContainer,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useRouter } from 'next/router'

import * as styles from './personalTaxCreditForm.treat'
import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import cn from 'classnames'

import { NavigationProps } from '@island.is/financial-aid/shared'

const PersonalTaxCreditForm = () => {
  const router = useRouter()
  const { form, updateForm } = useContext(FormContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const [error, setError] = useState(false)

  const options = [
    {
      label: 'Já, nýta persónuafslátt',
      value: 0,
    },
    {
      label: 'Nei, nýti ekki persónuafslátt',
      value: 1,
    },
  ]

  return (
    <FormLayout
      activeSection={navigation?.activeSectionIndex}
      activeSubSection={navigation?.activeSubSectionIndex}
    >
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={2}>
          Viltu nota persónuafslátt?
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Langflestir sem fá fjárhagsaðstoð kjósa að nýta sér persónuafsláttinn.
          Almennt má segja að „Já“ sé besti kostur nema þú vitir sérstaklega um
          annað sem þú vilt nýta hann í.
        </Text>

        <RadioButtonContainer
          className={styles.container}
          options={options}
          error={error && !form?.usePersonalTaxCredit}
          isChecked={(value: number | boolean) => {
            return value === form?.usePersonalTaxCredit
          }}
          onChange={(value: number | boolean) => {
            updateForm({ ...form, usePersonalTaxCredit: value })
            if (error) {
              setError(false)
            }
          }}
        />

        <div
          className={cn({
            [`errorMessage`]: true,
            [`showErrorMessage`]:
              error && form?.usePersonalTaxCredit === undefined,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að svara
          </Text>
        </div>

        <Text as="h2" variant="h3" marginBottom={2} marginTop={[2, 2, 3]}>
          Nánar um persónuafslátt
        </Text>
        <Text marginBottom={[5, 5, 4]}>
          Persónuafsláttur er skattaafsláttur sem veittur er öllum einstaklingum
          eldri en 16 ára. Persónuafslætti má safna upp á milli mánaða og nýta
          síðar. Uppsafnaður persónuafsláttur sem ekki er nýttur innan árs
          fellur niður við lok þess.
        </Text>
      </FormContentContainer>

      <FormFooter
        previousUrl={navigation?.prevUrl ?? '/'}
        nextUrl={navigation?.nextUrl ?? '/'}
        onNextButtonClick={() => {
          if (form?.usePersonalTaxCredit !== undefined) {
            router.push(navigation?.nextUrl ?? '/')
          } else {
            setError(true)
          }
        }}
      />
    </FormLayout>
  )
}

export default PersonalTaxCreditForm
