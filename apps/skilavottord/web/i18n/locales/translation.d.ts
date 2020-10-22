// To parse this data:
//
//   import { Convert, Translation } from ./file;
//
//   const translation = Convert.toTranslation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Translation {
  home: Home
  header: Header
  myCars: MyCars
  confirm: Confirm
  handover: Handover
  completed: Completed
  processes: Processes
  companyOverview: CompanyOverview
  companyInfo: CompanyInfo
  companyInfoForm: CompanyInfoFormPage
  companySidenav: CompanySidenav
  deregisterVehicle: DeregisterVehicle
  routes: Routes
}

export interface Home {
  title: string
}

export interface Header {
  logoutText: string
}

export interface MyCars {
  title: string
  subTitles: MyCarsSubtitles
  info: MyCarsInfo
  actions: CarActions
  status: CarStatus
  buttons: CarsButtons
  tooltip: ToolTip
  error: Errors
}

export interface Confirm {
  title: string
  subTitles: ConfirmSubTitles
  info: string
  buttons: ProcessButtons
  checkbox: CheckBox
}

export interface Handover {
  title: string
  subTitles: HandoverSubTitles
  info: string
  subInfo: string
  buttons: HandoverButtons
  cancelModal: CancelModal
}

export interface Completed {
  title: string
  subTitles: CompletedSubTitles
  info: CompletedInfo
  confirmedBy: CompletedConfirmation
  buttons: CompletedButtons
}

export interface Processes {
  citizen: ProcessSections
  company: ProcessSections
}

export interface ProcessSections {
  title: string
  sections: string[]
  completed: string
}

export interface CancelModal {
  title: string
  info: string
  buttons: ProcessButtons
}

export interface MyCarsSubtitles {
  pending: string
  active: string
  done: string
}

export interface MyCarsSubtitles {
  noCarsAvailable: string
}

export interface CarActions {
  valid: string
  invalid: string
}

export interface CarStatus {
  coOwned: string
  recycle: string
  done: string
}

export interface CarsButtons {
  openProcess: string
  seeDetails: string
  reload: string
}

export interface ToolTip {
  text: string
  link: string
}

export interface ConfirmSubTitles {
  confirm: string
}

export interface ProcessButtons {
  cancel: string
  continue: string
}

export interface CheckBox {
  label: string
  linkLabel: string
}

export interface HandoverSubTitles {
  nextStep: string
  companies: string
}

export interface HandoverButtons extends ProcessButtons {
  close: string
}

export interface CompletedSubTitles {
  summary: string
  payment: string
}

export interface CompletedInfo {
  payment: string
  paymentLinkText: string
}

export interface CompletedConfirmation {
  user: string
  company: string
  authority: string
  fund: string
}

export interface CompletedButtons extends ProcessButtons {
  close: string
}

export interface Errors {
  title: string
  message: string
  primaryButton: string
  secondaryButton: string
}

export interface CompanyOverview {
  title: string
  info: string
  subtitles: CompanyOverviewSubTitles
  buttons: CompanyOverviewButtons
  search: InputField
  table: string[]
}

export interface CompanyInfo {
  title: string
  info: string
  subtitles: CompanyInfoSubTitles
  buttons: CompanyInfoButtons
}

export interface CompanyInfoFormPage {
  addTitle: string
  editTitle: string
  form: CompanyInfoForm
  buttons: CompanyInfoFormButtons
}

export interface CompanyInfoForm {
  title: string
  company: InputField
  visitingAddress: InputField
  postNumber: InputField
  city: InputField
  website: InputField
  phoneNumber: InputField
}

export interface CompanySidenav {
  deregister: string
  companyInfo: string
}

export interface DeregisterVehicle {
  select: DeregisterSelect
  deregister: Deregister
}

export interface DeregisterSelect {
  title: string
  info: string
  input: InputField
  buttons: DeregisterSelectButtons
}

export interface Deregister {
  title: string
  info: string
  buttons: DeregisterButtons
}

export interface CompanyOverviewSubTitles {
  history: string
}

export interface CompanyOverviewButtons {
  deregister: string
}

export interface CompanyInfoSubTitles {
  companyLocation: string
}

export interface CompanyOverviewButtons {
  add: string
  delete: string
  edit: string
}

export interface DeregisterSelectButtons {
  cancel: string
  continue: string
}

export interface DeregisterButtons {
  back: string
  confirm: string
}

export interface InputField {
  label: string
  placeholder: string
}

export interface Routes {
  home: string
  myCars: string
  recycleVehicle: RecycleVehicleRoutes
  deregisterVehicle: DeregisterVehicleRoutes
  companyInfo: CompanyInfoRoutes
}

export interface RecycleVehicleRoutes {
  baseRoute: string
  confirm: string
  handover: string
  completed: string
}

export interface DeregisterVehicleRoutes {
  baseRoute: string
  select: string
  deregister: string
}

export interface CompanyInfoRoutes {
  baseRoute: string
  add: string
  edit: string
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toTranslation(json: string): Translation {
    return cast(JSON.parse(json), r('Translation'))
  }

  public static translationToJson(value: Translation): string {
    return JSON.stringify(uncast(value, r('Translation')), null, 2)
  }
}

function invalidValue(typ: any, val: any): never {
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`,
  )
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }))
    typ.jsonToJS = map
  }
  return typ.jsonToJS
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }))
    typ.jsToJSON = map
  }
  return typ.jsToJSON
}

function transform(val: any, typ: any, getProps: any): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val
    return invalidValue(typ, val)
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length
    for (let i = 0; i < l; i++) {
      const typ = typs[i]
      try {
        return transform(val, typ, getProps)
      } catch (_) {}
    }
    return invalidValue(typs, val)
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val
    return invalidValue(cases, val)
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val)
    return val.map((el) => transform(el, typ, getProps))
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null
    }
    const d = new Date(val)
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val)
    }
    return d
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val)
    }
    const result: any = {}
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key]
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined
      result[prop.key] = transform(v, prop.typ, getProps)
    })
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps)
      }
    })
    return result
  }

  if (typ === 'any') return val
  if (typ === null) {
    if (val === null) return val
    return invalidValue(typ, val)
  }
  if (typ === false) return invalidValue(typ, val)
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref]
  }
  if (Array.isArray(typ)) return transformEnum(typ, val)
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val)
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val)
  return transformPrimitive(typ, val)
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps)
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps)
}

function a(typ: any) {
  return { arrayItems: typ }
}

function u(...typs: any[]) {
  return { unionMembers: typs }
}

function o(props: any[], additional: any) {
  return { props, additional }
}

function m(additional: any) {
  return { props: [], additional }
}

function r(name: string) {
  return { ref: name }
}

const typeMap: any = {
  Translation: o([{ json: 'home', js: 'home', typ: r('Home') }], false),
  Home: o([{ json: 'title', js: 'title', typ: '' }], false),
}
