import React from 'react'
import { Formik, Form, Field } from 'formik'

import {
  Box,
  Column,
  Columns,
  ButtonDeprecated as Button,
  Typography,
  Option,
} from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'
import { Company } from '@island.is/gjafakort-web/graphql/schema'
import { FieldSelect } from '@island.is/gjafakort-web/components'

interface PropTypes {
  onSubmit: (values: Company) => void
  companies: Company[]
}

interface FormValues {
  company: Option | undefined
}

function SelectionForm({ onSubmit, companies }: PropTypes) {
  const {
    t: { companySignup: t },
  } = useI18n()

  return (
    <Formik
      initialValues={
        {
          company: undefined,
        } as FormValues
      }
      onSubmit={({ company }) => {
        onSubmit({
          name: company.label,
          ssn: company.value.toString(),
        })
      }}
      enableReinitialize
    >
      {() => (
        <Form>
          <Box marginBottom={6}>
            <Typography variant="intro">{t.intro}</Typography>
          </Box>
          <Columns space="gutter" collapseBelow="xl">
            <Column width="1/2">
              <Box marginBottom={6}>
                <Field
                  component={FieldSelect}
                  name="company"
                  label={t.form.company.label}
                  placeholder={t.form.company.placeholder}
                  options={companies.map((company) => ({
                    label: company.name,
                    value: company.ssn,
                  }))}
                />
              </Box>
              <Button htmlType="submit">{t.form.submit}</Button>
            </Column>
          </Columns>
          <Columns space="gutter" collapseBelow="xl">
            <Column width="2/3">
              <Box marginTop={6}>
                <Typography variant="p">{t.caption}</Typography>
              </Box>
            </Column>
          </Columns>
        </Form>
      )}
    </Formik>
  )
}

export default SelectionForm
