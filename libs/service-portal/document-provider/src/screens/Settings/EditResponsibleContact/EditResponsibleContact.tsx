import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text, toast } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import {
  ResponsibleContactFormData,
  ResponsibleContactForm,
} from '../../../components/Forms/ResponsibleContactForm'

const EditResponsibleContact: ServicePortalModuleComponent = ({}) => {
  const { formatMessage } = useLocale()

  const handleSubmit = (data: ResponsibleContactFormData) => {
    submitFormData(data)
  }

  const submitFormData = async (formData: ResponsibleContactFormData) => {
    //TODO: Set up submit
    console.log(formData)
    toast.success('Ábyrgðarmaður vistaður')
  }

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={4}>
        <Text variant="h1" as="h1">
          {formatMessage(m.SettingsEditResponsibleContactTitle)}
        </Text>
      </Box>
      <ResponsibleContactForm onSubmit={handleSubmit} />
    </Box>
  )
}

export default EditResponsibleContact
