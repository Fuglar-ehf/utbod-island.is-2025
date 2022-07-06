import { ApplicationWithAttachments as Application } from '@island.is/application/types'

export interface DecodedAssignmentToken {
  applicationId: string
  state: string
  nonce: string
  iat: number
  exp: number
}

export interface StateChangeResult {
  error?: string
  hasError: boolean
  hasChanged: boolean
  application: Application
}

export interface TemplateAPIModuleActionResult {
  updatedApplication: Application
  hasError: boolean
  error?: string
}
