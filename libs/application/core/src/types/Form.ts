import { ZodObject } from 'zod'
import { Condition } from './Condition'
import { Field } from './Fields'
import { MessageDescriptor } from 'react-intl'
import { BoxProps } from '@island.is/island-ui/core'
import { Application } from './Application'

export type StaticText = (MessageDescriptor & { values?: object }) | string

export type FormText =
  | StaticText
  | ((application: Application) => StaticText | null | undefined)
export type FormTextArray =
  | StaticText[]
  | ((application: Application) => (StaticText | null | undefined)[])

export enum FormItemTypes {
  FORM = 'FORM',
  SECTION = 'SECTION',
  SUB_SECTION = 'SUB_SECTION',
  REPEATER = 'REPEATER',
  MULTI_FIELD = 'MULTI_FIELD',
  EXTERNAL_DATA_PROVIDER = 'EXTERNAL_DATA_PROVIDER',
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Schema = ZodObject<any>

export enum FormModes {
  APPLYING = 'applying',
  APPROVED = 'approved',
  PENDING = 'pending',
  REVIEW = 'review',
  REJECTED = 'rejected',
}

export interface Form {
  id: string
  title: StaticText
  logo?: React.FC
  type: FormItemTypes.FORM
  mode?: FormModes
  renderLastScreenButton?: boolean
  icon?: string
  children: FormChildren[]
}

export type FormLeaf = MultiField | Field | Repeater | ExternalDataProvider
export type FormNode = Form | Section | SubSection | FormLeaf
export type FormChildren = Section | FormLeaf
export type SectionChildren = SubSection | FormLeaf

export interface FormItem {
  readonly id?: string
  condition?: Condition
  readonly type: string
  readonly title: FormText
}

export interface Section extends FormItem {
  type: FormItemTypes.SECTION
  children: SectionChildren[]
}

export interface SubSection extends FormItem {
  type: FormItemTypes.SUB_SECTION
  children: FormLeaf[]
}

export interface Repeater extends FormItem {
  readonly id: string
  type: FormItemTypes.REPEATER
  // Repeaters always have custom representation
  component: string
  children: FormLeaf[]
  isPartOfRepeater?: boolean
}

export interface MultiField extends FormItem {
  type: FormItemTypes.MULTI_FIELD
  children: Field[]
  isPartOfRepeater?: boolean
  readonly description?: FormText
  space?: BoxProps['paddingTop']
}

export interface ExternalDataProvider extends FormItem {
  readonly type: FormItemTypes.EXTERNAL_DATA_PROVIDER
  readonly children: undefined
  isPartOfRepeater?: boolean
  dataProviders: DataProviderItem[]
}

export interface DataProviderItem {
  readonly id: string
  readonly type: string | undefined
  readonly title: StaticText
  readonly subTitle?: StaticText
  readonly source?: string
}

export interface FieldBaseProps {
  autoFocus?: boolean
  error?: string
  field: Field
  application: Application
  showFieldName?: boolean
  goToScreen?: (id: string) => void
  refetch?: () => void
}

export type RepeaterProps = {
  application: Application
  expandRepeater: () => void
  error?: string
  repeater: Repeater
  removeRepeaterItem: (index: number) => void
}
