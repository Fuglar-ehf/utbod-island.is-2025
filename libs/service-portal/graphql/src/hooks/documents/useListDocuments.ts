import { useQuery } from '@apollo/client'
import { Document, GetDocumentListInput, Query } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'

interface UseListDocumentsProps {
  data: {
    documents: Document[]
  }
  totalCount: number
  unreadCounter: number
  loading?: boolean
  error?: any
}

export const useListDocuments = (
  input?: GetDocumentListInput,
): UseListDocumentsProps => {
  const {
    senderKennitala,
    dateFrom,
    dateTo,
    categoryId,
    subjectContains,
    typeId,
    sortBy,
    order,
    opened,
    page,
    pageSize,
    isLegalGuardian,
  } = input ?? {}
  const { data, loading, error } = useQuery<Query>(LIST_DOCUMENTS, {
    variables: {
      input: {
        senderKennitala,
        dateFrom,
        dateTo,
        categoryId,
        subjectContains,
        typeId,
        sortBy,
        order,
        opened,
        page,
        pageSize,
        isLegalGuardian,
      },
    },
  })
  const documents = data?.listDocumentsV2?.data || []
  const totalCount = data?.listDocumentsV2?.totalCount || 0

  return {
    data: { documents },
    totalCount,
    unreadCounter: documents.filter((x) => x.opened === false).length,
    loading,
    error,
  }
}
