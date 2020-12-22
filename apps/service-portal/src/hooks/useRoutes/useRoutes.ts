import { useStore } from '../../store/stateProvider'
import { useEffect } from 'react'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { Action, ActionType } from '../../store/actions'
import { useModuleProps } from '../useModuleProps/useModuleProps'
import { User } from 'oidc-client'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import flatten from 'lodash/flatten'

export const useRoutes = () => {
  const [{ modules }, dispatch] = useStore()
  const { userInfo, client } = useModuleProps()

  const arrangeRoutes = async (
    userInfo: User,
    dispatch: (action: Action) => void,
    modules: ServicePortalModule[],
    client: ApolloClient<NormalizedCacheObject>,
  ) => {
    const routes = await Promise.all(
      modules.map((module) =>
        module.routes({
          userInfo,
          client,
        }),
      ),
    )

    dispatch({
      type: ActionType.SetRoutesFulfilled,
      payload: flatten(routes),
    })
  }

  useEffect(() => {
    if (userInfo === null) return
    arrangeRoutes(userInfo, dispatch, modules, client)
  }, [userInfo, dispatch, modules, client])
}

export default useRoutes
