import React, { useState } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from './../../../components/Layout/ContentWrapper'
import IdpProviderCreateForm from './../../../components/Admin/form/IdpProviderCreateForm'
import { IdpProvider } from './../../../entities/models/IdpProvider.model'
import { IdpProviderDTO } from './../../../entities/dtos/idp-provider.dto'

const Index: React.FC = () => {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  const handleIdpProviderSaved = (idpProviderSaved: IdpProvider) => {
    if (idpProviderSaved.name) router.push('/admin/?tab=2')
  }

  return (
    <ContentWrapper>
      <IdpProviderCreateForm
        handleCancel={handleCancel}
        idpProvider={new IdpProviderDTO()}
        handleSaveButtonClicked={handleIdpProviderSaved}
      />
    </ContentWrapper>
  )
}
export default Index
