import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import React, { ReactElement, useState } from 'react'
import NestedInfoLines from '../../../Medicine/components/NestedInfoLines/NestedInfoLines'
import { useLocale } from '@island.is/localization'
import {
  HealthCenter,
  HealthCenterData,
  MedicinePrescriptionDetail,
  MedicinePrescriptionDetailData,
  Prescription,
} from '../../../Medicine/utils/mockData'
import * as styles from './RenewPrescriptionModal.css'
import { messages } from '../../../../lib/messages'
import cn from 'classnames'

interface Props {
  id: string
  activePrescription?: Prescription
  disclosure?: ReactElement
}

interface RenewFormData {
  healthcare?: HealthCenter
  medicineInformation?: Prescription
}

const RenewPrescriptionModal: React.FC<Props> = ({
  id,
  activePrescription,
  disclosure,
}) => {
  const { formatMessage } = useLocale()
  const columnWidth = '7/12'
  const titleWidth = '5/12'
  const modulusCalculations = (index: number) => {
    return index % 4 === 0 || index % 4 === 1
  }
  const [selectedMedicine, setSelectedMedicine] = useState('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [formData, setFormData] = useState<RenewFormData | null>(
    {
      healthcare: HealthCenterData[1],
      medicineInformation: activePrescription,
    } ?? null,
  )

  const closeModal = () => {
    setModalVisible(false)
  }

  const submitForm = async (e?: React.FormEvent<HTMLFormElement>) => {
    // TODO: Implement form submission when service is ready
    e && e.preventDefault()
    const formData2 = e && new FormData(e.currentTarget)
    const data = formData2 && Object.fromEntries(formData2.entries())
    console.log(data)
    setFormData(null)
    setModalVisible(false)
  }

  return (
    <ModalBase
      baseId={'renewPrescriptionModal'}
      isVisible={modalVisible}
      initialVisibility={false}
      onVisibilityChange={(visibility) => {
        setModalVisible(visibility)
      }}
      removeOnClose
      disclosure={disclosure}
      className={styles.modal}
    >
      <Box paddingY={8} paddingX={12}>
        <Text variant="h3" marginBottom={5}>
          {formatMessage(messages.renewalMedicineRequest)}
        </Text>
        <Text>{formatMessage(messages.renewalMedicineRequestText)}</Text>

        <Text variant="small" fontWeight="medium" marginBottom={1}>
          {formatMessage(messages.medicineInformation)}
        </Text>

        <Box>
          <GridContainer className={styles.grid}>
            <GridRow>
              {MedicinePrescriptionDetailData.map((item, i) => (
                <GridColumn key={i} span={'6/12'}>
                  <GridContainer
                    className={cn(styles.innerGrid, {
                      [styles.blue]: modulusCalculations(i),
                    })}
                  >
                    <GridRow>
                      <GridColumn span={titleWidth}>
                        <Box className={styles.titleCol}>
                          <Text fontWeight="semiBold" variant="small" as="span">
                            {item.title}
                          </Text>
                        </Box>
                      </GridColumn>
                      <GridColumn span={columnWidth} className={styles.data}>
                        <Text variant="small" truncate>
                          {item.value}
                        </Text>
                      </GridColumn>
                    </GridRow>
                  </GridContainer>
                </GridColumn>
              ))}
            </GridRow>
            <GridRow>
              <GridColumn span={'12/12'}>
                <Button>Button</Button>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default RenewPrescriptionModal
