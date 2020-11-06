import React from 'react'
import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as z from 'zod'

import { FormShell } from './FormShell'
import {
  Application,
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
} from '@island.is/application/core'
import { initializeClient } from '@island.is/application/graphql'
import { ApolloProvider } from '@apollo/client'
import { LocaleProvider } from '@island.is/localization'

describe(' FormShell', () => {
  const applicant = '1111112219'
  const application: Application = {
    id: '12315151515',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    attachments: {},
    externalData: {},
    answers: {},
    applicant,
    state: 'draft',
    modified: new Date(),
    created: new Date(),
  }
  const form: Form = buildForm({
    id: 'ParentalLeaveForm',
    name: 'Umsókn um fæðingarorlof',
    children: [
      buildIntroductionField({
        id: 'intro',
        name: 'velkomin',
        introduction: 'This is an awesome application',
      }),
    ],
  })

  it('should render successfully', async () => {
    let baseElement
    await act(async () => {
      const wrapper = await render(
        <ApolloProvider client={initializeClient('')}>
          <LocaleProvider locale="is" messages={{}}>
            <FormShell
              application={application}
              dataSchema={z.object({})}
              form={form}
              nationalRegistryId={applicant}
            />
          </LocaleProvider>
        </ApolloProvider>,
      )
      baseElement = wrapper.baseElement
    })
    expect(baseElement).toBeTruthy()
  })

  it('should render the application title', async () => {
    await act(async () => {
      await render(
        <ApolloProvider client={initializeClient('')}>
          <LocaleProvider locale="is" messages={{}}>
            <FormShell
              application={application}
              dataSchema={z.object({})}
              form={form}
              nationalRegistryId={applicant}
            />
          </LocaleProvider>
        </ApolloProvider>,
      )
    })
    expect(screen.getByText(`Umsókn um fæðingarorlof`)).toBeInTheDocument()
  })
})
