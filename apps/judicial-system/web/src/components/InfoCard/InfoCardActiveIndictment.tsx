import { useContext } from 'react'

import { FormContext } from '../FormProvider/FormProvider'
import InfoCard from './InfoCard'
import useInfoCardItems from './useInfoCardItems'

interface Props {
  displayVerdictViewDate?: boolean
}

const InfoCardActiveIndictment: React.FC<Props> = (props) => {
  const { displayVerdictViewDate } = props
  const { workingCase } = useContext(FormContext)
  const {
    defendants,
    indictmentCreated,
    prosecutor,
    policeCaseNumbers,
    court,
    offenses,
    mergedCasePoliceCaseNumbers,
    mergedCaseCourtCaseNumber,
    mergedCaseProsecutor,
    mergedCaseJudge,
    mergedCaseCourt,
    civilClaimants,
  } = useInfoCardItems()

  return (
    <InfoCard
      sections={[
        {
          id: 'defendant-section',
          items: [
            defendants(workingCase.type, undefined, displayVerdictViewDate),
          ],
        },
        ...(workingCase.hasCivilClaims
          ? [{ id: 'civil-claimant-section', items: [civilClaimants] }]
          : []),
        {
          id: 'case-info-section',
          items: [
            indictmentCreated,
            prosecutor(workingCase.type),
            policeCaseNumbers,
            court,
            offenses,
          ],
          columns: 2,
        },
        ...(workingCase.mergedCases && workingCase.mergedCases.length > 0
          ? workingCase.mergedCases.map((mergedCase) => {
            console.log({mergedCase})
            return ({
              id: mergedCase.id,
              items: [
                mergedCasePoliceCaseNumbers(mergedCase),
                mergedCaseCourtCaseNumber(mergedCase),
                mergedCaseProsecutor(mergedCase),
                mergedCaseJudge(mergedCase),
                mergedCaseCourt(mergedCase),
              ],
              columns: 2,
            })})
          : []),
      ]}
    />
  )
}

export default InfoCardActiveIndictment
