import ContentWrapper from './../../../components/Layout/ContentWrapper'
import React from 'react'
import ApiScopeCreateForm from '../../../components/Resource/forms/ApiScopeCreateForm'
import { ApiScopeDTO } from '../../../entities/dtos/api-scope-dto'
import { useRouter } from 'next/router'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'

const Index: React.FC = () => {
  const router = useRouter()

  const handleSave = (data: ApiScopeDTO) => {
    router.push(`/resource/api-scope/${encodeURIComponent(data.name)}?step=2`)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiScopeCreateForm
        handleSave={handleSave}
        handleCancel={handleCancel}
        apiScope={new ApiScopeDTO()}
      />
    </ContentWrapper>
  )
}
export default Index
