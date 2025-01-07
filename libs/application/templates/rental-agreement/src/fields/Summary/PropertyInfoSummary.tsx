import {
  Box,
  Button,
  GridColumn,
  Icon,
  Link,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RentalAgreement } from '../../lib/dataSchema'
import {
  RentalHousingCategoryClass,
  RentalHousingConditionInspector,
  Routes,
} from '../../lib/constants'
import {
  getPropertyTypeOptions,
  getPropertyClassOptions,
  getPropertyClassGroupOptions,
} from '../../lib/utils'
import { KeyValue } from './components/KeyValue'
import { SummaryCardRow } from './components/SummaryCardRow'
import { SummaryCard } from './components/SummaryCard'

import { fileLink, fileLinksList } from './summaryStyles.css'
import { summary } from '../../lib/messages'

interface Props {
  answers: RentalAgreement
  goToScreen?: (id: string) => void
  categoryRoute?: Routes
  propertyInfoRoute?: Routes
  propertyDescriptionRoute?: Routes
  specialProvisionsRoute?: Routes
  propertyConditionRoute?: Routes
  fileUploadRoute?: Routes
  fireProtectionsRoute?: Routes
}

export const PropertyInfoSummary = ({
  answers,
  goToScreen,
  categoryRoute,
  propertyInfoRoute,
  propertyDescriptionRoute,
  specialProvisionsRoute,
  propertyConditionRoute,
  fileUploadRoute,
  fireProtectionsRoute,
}: Props) => {
  const { formatMessage } = useLocale()

  const propertyType = (answer: string) => {
    const options = getPropertyTypeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const propertyClass = (answer: string) => {
    const options = getPropertyClassOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const propertyClassGroup = (answer: string) => {
    const options = getPropertyClassGroupOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const uploadFiles = answers.condition.resultsFiles as UploadFile[]

  console.log('UploadFiles: ', uploadFiles)

  return (
    <SummaryCard cardLabel={formatMessage(summary.propertyInfoHeader)}>
      <SummaryCardRow editAction={goToScreen} route={categoryRoute}>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <KeyValue
            label={summary.propertyTypeLabel}
            value={
              propertyType(answers.registerProperty.categoryType as string) ||
              '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <KeyValue
            label={summary.propertyClassLabel}
            value={
              propertyClass(answers.registerProperty.categoryClass as string) ||
              '-'
            }
          />
        </GridColumn>
        {answers.registerProperty.categoryClass ===
          RentalHousingCategoryClass.SPECIAL_GROUPS &&
          answers.registerProperty.categoryClassGroup && (
            <GridColumn span={['12/12', '12/12', '12/12', '12/12', '4/12']}>
              <KeyValue
                label={summary.propertyClassGroupLabel}
                value={
                  propertyClassGroup(
                    answers.registerProperty.categoryClassGroup as string,
                  ) || '-'
                }
              />
            </GridColumn>
          )}
      </SummaryCardRow>

      <SummaryCardRow editAction={goToScreen} route={propertyInfoRoute}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.PropertyNumOfRoomsLabel}
            value={answers.registerProperty.numOfRooms || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.propertySizeLabel}
            value={answers.registerProperty.size || '-'}
          />
        </GridColumn>
      </SummaryCardRow>

      <SummaryCardRow editAction={goToScreen} route={propertyDescriptionRoute}>
        <GridColumn span={['12/12']}>
          <KeyValue
            label={summary.propertyDescriptionLabel}
            value={answers.specialProvisions.descriptionInput || '-'}
          />
        </GridColumn>
      </SummaryCardRow>

      <SummaryCardRow editAction={goToScreen} route={specialProvisionsRoute}>
        <GridColumn span={['12/12']}>
          <KeyValue
            label={summary.PropertySpecialProvisionsLabel}
            value={answers.specialProvisions.rulesInput || '-'}
          />
        </GridColumn>
      </SummaryCardRow>

      <SummaryCardRow editAction={goToScreen} route={propertyConditionRoute}>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12', '4/12']}>
          <KeyValue
            label={summary.propertyConditionInspectorLabel}
            value={
              answers.condition.inspector ===
                RentalHousingConditionInspector.INDEPENDENT_PARTY &&
              answers.condition.inspectorName
                ? `${formatMessage(
                    summary.propertyConditionInspectorValuePrefix,
                  )}: ${answers.condition.inspectorName}`
                : `${formatMessage(
                    summary.propertyConditionInspectorValuePrefix,
                  )}${formatMessage(
                    summary.propertyConditionInspectorValueContractParties,
                  )}`
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12', '8/12']}>
          <KeyValue
            label={summary.propertyConditionDescriptionLabel}
            value={answers.condition.resultsDescription || '-'}
          />
        </GridColumn>
      </SummaryCardRow>

      {uploadFiles.length > 0 && (
        <SummaryCardRow editAction={goToScreen} route={fileUploadRoute}>
          <GridColumn span={['12/12']}>
            <Box paddingY={'p2'}>
              <Text
                variant={'small'}
                as={'label'}
                fontWeight="semiBold"
                marginBottom={1}
              >
                {formatMessage(summary.fileUploadLabel)}
              </Text>
              <ul className={fileLinksList}>
                {uploadFiles.map((file) => (
                  <li key={file.name} className={fileLink}>
                    <Button
                      key={file.name}
                      icon="download"
                      variant="text"
                      size="small"
                      iconType="outline"
                      truncate={true}
                      onClick={() => {
                        console.log('FileName:', file.name)
                        console.log('FileKey:', file.key)
                        // TODO: Implement download file url
                        window.open(file.key)
                      }}
                    >
                      {file.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </Box>
          </GridColumn>
        </SummaryCardRow>
      )}

      <SummaryCardRow
        editAction={goToScreen}
        route={fireProtectionsRoute}
        isLast={true}
      >
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsSmokeDetectorsLabel}
            value={answers.fireProtections.smokeDetectors || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsFireExtinguisherLabel}
            value={answers.fireProtections.fireExtinguisher || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsExitsLabel}
            value={answers.fireProtections.exits || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsFireBlanketLabel}
            value={answers.fireProtections.fireBlanket || '-'}
          />
        </GridColumn>
      </SummaryCardRow>
    </SummaryCard>
  )
}
