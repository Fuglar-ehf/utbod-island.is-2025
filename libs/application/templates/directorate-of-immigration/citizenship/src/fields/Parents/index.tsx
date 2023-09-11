import { NationalRegistryParent } from '@island.is/application/types'
import { useEffect, useState } from 'react'
import { information } from '../../lib/messages'
import { Box } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { ParentsToApplicant } from '../../shared'
import { ParentRepeaterItem } from './ParentRepeaterItem'

export const Parents = ({ field, application, errors }: any) => {
  const {
    externalData: { nationalRegistryParents },
    answers,
  } = application

  const [hasValidParents, setHasValidParents] = useState(
    getValueViaPath(answers, 'parentInformation.hasValidParents', NO) as string,
  )

  console.log('application', application)

  let parentsFoundFromAnswer: '0' | '1' | '2' =
    nationalRegistryParents.length == 1
      ? '1'
      : nationalRegistryParents.length === 2
      ? '2'
      : '0'

  const defaultParents = [
    { nationalId: '', givenName: '', familyName: '', wasRemoved: 'false' },
    { nationalId: '', givenName: '', familyName: '', wasRemoved: 'true' },
  ]

  const [parents, setParents] = useState<ParentsToApplicant[]>(
    getValueViaPath(
      answers,
      'parentInformation.parents',
      nationalRegistryParents.data.map((x: NationalRegistryParent) => {
        return { ...x, wasRemoved: 'false' }
      }) as ParentsToApplicant[],
    ) as ParentsToApplicant[],
  )

  console.log('parents here', parents)

  const { formatMessage } = useLocale()

  useEffect(() => {
    //Valid parents from answers
    let validParents = parents.filter(
      (x) => x.nationalId && x.nationalId !== '',
    )

    //if the user has answered YES previously and is returning to the step and has one valid parent from previous answers
    //set the valid parent and set the second as default wasRemoved=true
    if (hasValidParents === YES && validParents.length === 1) {
      console.log('should be in here')
      setParents([...validParents, { ...defaultParents[1] }])
    }

    if (hasValidParents === NO) {
      //set two parents with wasRemoved = true to pass validation but also to exist if user toggles to Yes
      setParents([defaultParents[1], defaultParents[1]])
    }
  }, [])

  const addParentToApplication = (newIndex: number) => {
    setParents(
      parents.map((parent, index) => {
        if (newIndex === index) {
          const a = { ...parent, wasRemoved: 'false' }
          return a
        }
        return parent
      }),
    )
  }

  const handleRemoveAll = () => {
    setParents(
      parents.map((p) => {
        return { ...p, wasRemoved: 'true' }
      }),
    )
  }

  const handleToggleYes = () => {
    setParents(
      parents.map((p, index) => {
        if (index === 0) {
          return { ...p, wasRemoved: 'false' }
        } else return p
      }),
    )
  }

  const handleValidParentsChange = (value: string) => {
    setHasValidParents(value)

    if (value === NO) {
      handleRemoveAll()
    } else {
      handleToggleYes()
    }
  }

  return (
    <Box>
      <RadioController
        id={'parentInformation.hasValidParents'}
        split="1/2"
        onSelect={(value) => {
          handleValidParentsChange(value)
        }}
        defaultValue={hasValidParents === YES ? hasValidParents : ''}
        options={[
          {
            value: YES,
            label: formatMessage(
              information.labels.radioButtons.radioOptionYes,
            ),
          },
          {
            value: NO,
            label: formatMessage(information.labels.radioButtons.radioOptionNo),
          },
        ]}
      />

      {!!parents &&
        parents.map((parent, index) => {
          const position = parents.indexOf(parent)
          return (
            <ParentRepeaterItem
              index={index}
              field={field}
              application={application}
              errors={errors}
              itemNumber={position}
              isRequired={index === 0}
              repeaterField={parent}
              readOnly={
                (parent.nationalId &&
                  parent.nationalId !== '' &&
                  ((index === 0 && parentsFoundFromAnswer === '1') ||
                    parentsFoundFromAnswer === '2')) ||
                (index === 1 && parentsFoundFromAnswer === '2')
                  ? true
                  : false
              }
              addParentToApplication={addParentToApplication}
              isHidden={hasValidParents === NO}
            />
          )
        })}
    </Box>
  )
}
