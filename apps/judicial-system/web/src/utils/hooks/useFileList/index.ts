import { useContext, useEffect, useMemo, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { CaseFileState } from '@island.is/judicial-system/types'
import {
  LimitedAccessGetSignedUrlQuery,
  LimitedAccessGetSignedUrlQueryVariables,
  GetSignedUrlQuery,
  GetSignedUrlQueryVariables,
  GetSignedUrlDocument,
  LimitedAccessGetSignedUrlDocument,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'

interface Parameters {
  caseId: string
}

const useFileList = ({ caseId }: Parameters) => {
  const { limitedAccess } = useContext(UserContext)
  const { setWorkingCase } = useContext(FormContext)
  const [fileNotFound, setFileNotFound] = useState<boolean>()

  const [
    getSignedUrl,
    { error: fullAccessError, variables: fullAccessVariables },
  ] = useLazyQuery<GetSignedUrlQuery, GetSignedUrlQueryVariables>(
    GetSignedUrlDocument,
    {
      fetchPolicy: 'no-cache',
      onCompleted(data) {
        if (data?.getSignedUrl?.url) {
          window.open(data.getSignedUrl.url, '_blank')
        }
      },
    },
  )

  const [
    limitedAccessGetSignedUrl,
    { error: limitedAccessError, variables: limitedAccessVariables },
  ] = useLazyQuery<
    LimitedAccessGetSignedUrlQuery,
    LimitedAccessGetSignedUrlQueryVariables
  >(LimitedAccessGetSignedUrlDocument, {
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data?.limitedAccessGetSignedUrl?.url) {
        window.open(data.limitedAccessGetSignedUrl.url, '_blank')
      }
    },
  })

  useEffect(() => {
    const error = limitedAccess ? limitedAccessError : fullAccessError

    const variables = limitedAccess
      ? limitedAccessVariables
      : fullAccessVariables

    if (error && variables) {
      const code = error?.graphQLErrors[0].extensions?.code

      // If the file no longer exists or access in no longer permitted
      if (
        code === 'https://httpstatuses.org/404' ||
        code === 'https://httpstatuses.org/403'
      ) {
        setFileNotFound(true)
        setWorkingCase((theCase) => ({
          ...theCase,
          caseFiles: theCase.caseFiles?.map((file) =>
            file.id === variables.input.id
              ? {
                  ...file,
                  key: undefined,
                  status:
                    file.state === CaseFileState.STORED_IN_COURT
                      ? 'done-broken'
                      : 'broken',
                }
              : file,
          ),
        }))
      }
    }
  }, [
    fullAccessError,
    fullAccessVariables,
    limitedAccess,
    limitedAccessError,
    limitedAccessVariables,
    setWorkingCase,
  ])

  const onOpen = useMemo(
    () => (fileId: string) => {
      const query = limitedAccess ? limitedAccessGetSignedUrl : getSignedUrl

      query({ variables: { input: { id: fileId, caseId } } })
    },
    [caseId, getSignedUrl, limitedAccess, limitedAccessGetSignedUrl],
  )

  const dismissFileNotFound = () => {
    setFileNotFound(false)
  }

  return { fileNotFound, dismissFileNotFound, onOpen }
}

export default useFileList
