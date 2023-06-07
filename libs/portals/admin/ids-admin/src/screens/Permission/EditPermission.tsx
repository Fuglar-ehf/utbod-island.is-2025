import { PermissionBasicInfo } from './components/PermissionBasicInfo'
import { Box } from '@island.is/island-ui/core'

import { PermissionContent } from './components/PermissionContent'
import { PermissionAccessControl } from './components/PermissionAccessControl'
import { EnvironmentProvider } from '../../context/EnvironmentContext'
import { usePermission } from './PermissionContext'

export const EditPermission = () => {
  const { selectedPermission, permission } = usePermission()

  return (
    <EnvironmentProvider
      selectedEnvironment={selectedPermission.environment}
      availableEnvironments={permission.availableEnvironments}
    >
      <Box display="flex" flexDirection="column" rowGap={5}>
        <PermissionBasicInfo />
        <PermissionContent />
        <PermissionAccessControl />
      </Box>
    </EnvironmentProvider>
  )
}
