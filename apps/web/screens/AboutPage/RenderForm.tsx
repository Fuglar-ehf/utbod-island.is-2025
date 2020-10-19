import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import toQueryString from 'to-querystring'
import jsonp from 'jsonp'
import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { isValidEmail } from '@island.is/web/utils/isValidEmail'
import { NewsletterSignup } from '@island.is/island-ui/core'

type FormState = {
  type: '' | 'error' | 'success'
  message: string
  validEmail: boolean
  touched: boolean
}

// This component should be generalized a bit more and moved into @web/components

export const RenderForm: React.FC<{
  namespace: GetNamespaceQuery['getNamespace']
  heading?: string
  text?: string
  submitButtonText?: string
  inputLabel?: string
}> = ({
  namespace,
  heading = 'Default heading',
  text = 'Default text',
  submitButtonText = 'Submit',
  inputLabel = 'Email',
}) => {
  const n = useNamespace(namespace)
  const [status, setStatus] = useState<FormState>({
    type: '',
    message: '',
    validEmail: false,
    touched: false,
  })

  const formatMessage = (message) => {
    // These messages come from Mailchimp's API and contain links and other stuff we don't want.
    if (!message) {
      return
    }
    const msg = message.toLowerCase()

    if (
      msg.includes('is already subscribed') ||
      msg.includes('er nú þegar skráður')
    ) {
      return n('formEmailAlreadyRegistered', 'Þetta netfang er þegar á skrá')
    }

    if (msg.includes('invalid email') || msg.includes('ógilt netfang')) {
      return n('formInvalidEmail', 'Þetta er ógilt netfang.')
    }

    console.warn(message)
    return ''
  }

  const handleSubmit = ({ email }) => {
    const validEmail = isValidEmail.test(email)

    if (!validEmail) {
      setStatus({
        type: 'error',
        message: n('formInvalidEmail', 'Invalid email'),
        validEmail,
        touched: true,
      })
    }

    const params = toQueryString({ EMAIL: email })
    const url = `https://island.us18.list-manage.com/subscribe/post-json?u=be0aa222da8be6dcb70470af8&amp;id=6b6309b799&${params}`

    if (validEmail) {
      jsonp(
        url,
        {
          param: 'c',
        },
        (err, data) => {
          if (err) {
            setStatus({
              type: 'error',
              message: err,
              validEmail,
              touched: true,
            })
          } else if (data.result !== 'success') {
            setStatus({
              type: 'error',
              message: data.msg,
              validEmail,
              touched: true,
            })
          } else {
            setStatus({
              type: 'success',
              message: data.msg,
              validEmail,
              touched: true,
            })
          }
        },
      )
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (status.type === 'error' && formik.values.email === '') {
      setStatus({
        ...status,
        type: '',
      })
    }
  }, [status.type, formik.values.email])

  const headingByStatus =
    status.type === 'success'
      ? n('formThankYou', 'Skráning tókst. Takk fyrir.')
      : heading
  const textByStatus =
    status.type === 'success'
      ? n(
          'formCheckYourEmail',
          'Þú þarft að fara í pósthólfið þitt og samþykkja umsóknina',
        )
      : text

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewsletterSignup
        id="email"
        heading={headingByStatus}
        text={textByStatus}
        placeholder=""
        label={inputLabel}
        variant="blue"
        buttonText={submitButtonText}
        onChange={formik.handleChange}
        value={formik.values.email}
        errorMessage={formatMessage(status.message)}
        state={status.type || 'default'}
      />
    </form>
  )
}
