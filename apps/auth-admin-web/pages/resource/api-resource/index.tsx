import ContentWrapper from './../../../components/Layout/ContentWrapper'
import React from 'react'
import ApiResourceCreateForm from '../../../components/Resource/forms/ApiResourceCreateForm'
import { ApiResourcesDTO } from './../../../entities/dtos/api-resources-dto'
import { useRouter } from 'next/router'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'

const Index: React.FC = () => {
  const router = useRouter()

  const handleSave = (data: ApiResourcesDTO) => {
    router.push(
      `/resource/api-resource/${encodeURIComponent(data.name)}?step=2`,
    )
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiResourceCreateForm
        apiResource={new ApiResourcesDTO()}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </ContentWrapper>
  )
}
export default Index
