import { createContext, FC, useContext } from 'react'
import { useActionData, useLoaderData } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { useEnvironmentQuery } from '../../hooks/useEnvironmentQuery'
import { PermissionLoaderResult } from './Permission.loader'
import { EditPermissionResult } from './EditPermission.action'
import { PermissionFormTypes } from './EditPermission.schema'

type PermissionContextProps = {
  /**
   * Permission result loader query
   */
  permission: PermissionLoaderResult
  /**
   * Selected environment
   */
  selectedPermission: PermissionLoaderResult['environments'][0]
  /**
   * This is the result of the permission action
   */
  actionData: EditPermissionResult | undefined
  /**
   * This is the intent of the permission action, i.e. specific section of the form
   */
  intent: keyof typeof PermissionFormTypes
  onEnvironmentChange(environment: AuthAdminEnvironment): void
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined,
)

export const PermissionProvider: FC = ({ children }) => {
  const permissionResult = useLoaderData() as PermissionLoaderResult
  const actionData = useActionData() as EditPermissionResult
  const { environment, updateEnvironment } = useEnvironmentQuery(
    permissionResult.environments,
  )

  return (
    <PermissionContext.Provider
      value={{
        permission: permissionResult,
        selectedPermission: environment,
        onEnvironmentChange: updateEnvironment,
        actionData,
        intent: actionData?.intent,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermission = () => {
  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider')
  }

  return context
}
