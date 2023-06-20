import {
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
} from '@island.is/island-ui/core'
import { AdviceResult, Case, CaseExpressions } from '../../types/interfaces'
import {
  BlowoutList,
  CaseDocuments,
  CaseEmailBox,
  CaseOverview,
  CaseStatusBox,
  CaseTimeline,
  Coordinator,
  RenderAdvices,
} from './components'
import CaseSkeleton from './components/CaseSkeleton/CaseSkeleton'
import localization from './Case.json'

interface Props {
  chosenCase: Case
  expressions: CaseExpressions
  advices: Array<AdviceResult>
  advicesLoading: boolean
  refetchAdvices: any
}

const CaseDesktop = ({
  chosenCase,
  expressions,
  advices,
  advicesLoading,
  refetchAdvices,
}: Props) => {
  const loc = localization['case']
  const {
    caseNumber,
    id,
    documents,
    additionalDocuments,
    statusName,
    stakeholders,
    relatedCases,
    contactEmail,
    contactName,
  } = chosenCase
  const {
    isDocumentsNotEmpty,
    isAdditionalDocumentsNotEmpty,
    isStatusNameNotPublished,
    isStatusNameForReview,
    isStakeholdersNotEmpty,
    isRelatedCasesNotEmpty,
  } = expressions
  return (
    <CaseSkeleton caseNumber={caseNumber} caseId={id}>
      <GridContainer>
        <GridRow rowGap={3}>
          <GridColumn span={'3/12'}>
            <Stack space={3}>
              <Divider />
              <CaseTimeline chosenCase={chosenCase} />
              <Divider />
              {isDocumentsNotEmpty && (
                <CaseDocuments
                  title={loc.documentsBox.documents.title}
                  documents={documents}
                />
              )}
              {isAdditionalDocumentsNotEmpty && (
                <CaseDocuments
                  title={loc.documentsBox.additional.title}
                  documents={additionalDocuments}
                />
              )}
              {isStatusNameNotPublished && (
                <CaseEmailBox caseId={id} caseNumber={caseNumber} />
              )}
            </Stack>
          </GridColumn>
          <GridColumn span={'6/12'}>
            <Stack space={9}>
              <CaseOverview chosenCase={chosenCase} />
              <RenderAdvices
                advicesLoading={advicesLoading}
                isStatusNameForReview={isStatusNameForReview}
                advices={advices}
                chosenCase={chosenCase}
                refetchAdvices={refetchAdvices}
              />
            </Stack>
          </GridColumn>
          <GridColumn span={'3/12'}>
            <Stack space={3}>
              <CaseStatusBox status={statusName} />
              {isStakeholdersNotEmpty && (
                <BlowoutList list={stakeholders} isStakeholder />
              )}
              {isRelatedCasesNotEmpty && <BlowoutList list={relatedCases} />}
              <Coordinator
                contactEmail={contactEmail}
                contactName={contactName}
              />
            </Stack>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </CaseSkeleton>
  )
}

export default CaseDesktop
