import { createContext, useContext, useMemo } from 'react'
import { useLocation, matchPath, Outlet } from 'react-router-dom'
import { PortalModule, PortalRoute, PortalType } from '../types/portalCore'
import { useAuth } from '@island.is/auth/react'
import {
  ApolloClient,
  useApolloClient,
  NormalizedCacheObject,
} from '@apollo/client'

export type PortalMeta = {
  portalType: PortalType
  basePath: string
}

export type PortalContextProps = {
  activeModule?: PortalModule
  meta: PortalMeta
  modules: PortalModule[]
  routes: PortalRoute[]
}

export const PortalContext = createContext<PortalContextProps | undefined>(
  undefined,
)

type PortalProviderProps = Omit<PortalContextProps, 'activeModule'>

export const PortalProvider = ({
  meta,
  modules,
  routes,
}: PortalProviderProps) => {
  const { pathname } = useLocation()
  const { userInfo } = useAuth()
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>

  const activeModule = useMemo(
    () =>
      userInfo
        ? modules.find((module) =>
            module
              // Get all routes for the module
              .routes({
                userInfo,
                client,
              })
              // Extract the path from each route
              .map(({ path }) => path)
              // Find the route path that matches the current pathname
              .find((path) => matchPath(path, pathname)),
          )
        : undefined,
    [modules, pathname, userInfo],
  )

  return (
    <PortalContext.Provider
      value={{
        modules,
        meta,
        routes,
        activeModule,
      }}
    >
      <Outlet />
    </PortalContext.Provider>
  )
}

const useDynamicHook = <T extends keyof PortalContextProps>(
  fnName: string,
  key: T,
): PortalContextProps[T] => {
  const context = useContext(PortalContext)

  if (context === undefined) {
    throw new Error(`${fnName} must be used under PortalProvider`)
  }

  return context[key]
}

export const useModules = () => useDynamicHook(useModules.name, 'modules')
export const useRoutes = () => useDynamicHook(useRoutes.name, 'routes')
export const useActiveModule = () =>
  useDynamicHook(useActiveModule.name, 'activeModule')
export const usePortalMeta = () => useDynamicHook(usePortalMeta.name, 'meta')
