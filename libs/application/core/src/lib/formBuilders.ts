import { Field } from '../types/Fields'
import { Condition } from '../types/Condition'
import {
  Form,
  FormChildren,
  FormItemTypes,
  FormLeaf,
  MultiField,
  ExternalDataProvider,
  Repeater,
  Section,
  SectionChildren,
  SubSection,
  DataProviderItem,
  FormModes,
  FormText,
} from '../types/Form'
import { DataProviderTypes } from '../types/DataProvider'
import { MessageDescriptor } from 'react-intl'

export function buildForm(data: {
  id: string
  name: MessageDescriptor | string
  mode?: FormModes
  children: FormChildren[]
  icon?: string
}): Form {
  return { ...data, type: FormItemTypes.FORM }
}

export function buildMultiField(data: {
  id?: string
  condition?: Condition
  name: MessageDescriptor | string
  description?: FormText
  children: Field[]
}): MultiField {
  return { ...data, type: FormItemTypes.MULTI_FIELD }
}

export function buildRepeater(data: {
  id: string
  condition?: Condition
  component: string
  name: MessageDescriptor | string
  children: FormLeaf[]
}): Repeater {
  return { ...data, type: FormItemTypes.REPEATER, repetitions: 0 }
}

export function buildSection(data: {
  id?: string
  condition?: Condition
  name: MessageDescriptor | string
  children: SectionChildren[]
}): Section {
  return { ...data, type: FormItemTypes.SECTION }
}

export function buildSubSection(data: {
  id?: string
  condition?: Condition
  name: MessageDescriptor | string
  children: FormLeaf[]
}): SubSection {
  return { ...data, type: FormItemTypes.SUB_SECTION }
}

export function buildExternalDataProvider(data: {
  name: MessageDescriptor | string
  id: string
  condition?: Condition
  dataProviders: DataProviderItem[]
}): ExternalDataProvider {
  return {
    ...data,
    repeaterIndex: undefined,
    children: undefined,
    type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
  }
}

export function buildDataProviderItem(data: {
  id: string
  type: DataProviderTypes
  title: MessageDescriptor | string
  subTitle?: MessageDescriptor | string
  source?: string
}): DataProviderItem {
  return data
}
