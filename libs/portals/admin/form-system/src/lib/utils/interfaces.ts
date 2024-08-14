import { UniqueIdentifier } from '@dnd-kit/core'
import {
  FormSystemStep,
  FormSystemGroup,
  FormSystemInput,
  FormSystemLanguageType,
  FormSystemLanguageTypeInput,
  FormSystemListItem,
} from '@island.is/api/schema'

export enum NavbarSelectStatus {
  OFF = 'Off',
  NORMAL = 'Normal',
  LIST_ITEM = 'ListItem',
  ON_WITHOUT_SELECT = 'OnWithoutSelect',
}

export type ItemType = 'Step' | 'Group' | 'Input'

export interface ActiveItem {
  type: ItemType
  data?: FormSystemStep | FormSystemGroup | FormSystemInput | null
}

export interface IListItem {
  guid: UniqueIdentifier
  label: FormSystemLanguageType | FormSystemLanguageTypeInput
  description: FormSystemLanguageType | FormSystemLanguageTypeInput
  displayOrder: number
  isSelected: boolean
}

export enum EFormApplicantTypes {
  einstaklingur = 'Einstaklingur',
  einstaklingurMedUmbodAnnarsEinstaklings = 'Einstaklingur_með_umboð_annars_einstaklings',
  einstaklingurMedUmbodLogadila = 'Einstaklingur_með_umboð_lögaðila',
  einstaklingurMedProkuru = 'Einstaklingur_með_prókúru',
  einstaklingurUmbodsveitandi = 'Einstaklingur_umboðsveitandi',
  logadili = 'Lögaðili',
}

export interface InputSettings {
  hasInput?: boolean
  isList?: boolean
  isLarge?: boolean
  size?: string
  interval?: string
  list?: FormSystemListItem[]
  max?: number
  min?: number
  maxLength?: number
  minLength?: number
  amount?: number
  isMulti?: boolean
  maxSize?: number
  types?: string[]
  buttonText?: FormSystemLanguageType
  hasLink?: boolean
  $type?: string
  name?: FormSystemLanguageType
  [key: string]: unknown
}

export enum LicenseProviderEnum {
  sýslumannsembættið = 1,
  leyfisveitanEhf = 2,
  leyfisveitanEhf2 = 9,
  þjóðskráÍslands = 3,
  ferðamálastofa = 4,
  ferðamálastofa2 = 52,
  menntamálastofnun = 5,
  hallaBjörgBaldursdóttir = 6,
  fiskistofa = 7,
  officeOfDistrictMagistrate = 8,
  registersIceland = 10,
  icelandicTouristBoard = 11,
  directorateOfEducation = 12,
  hallaBjorgBaldursdottir = 13,
  directorateOfFisheries = 14,
  fjármálaOgEfnahagsráðuneytið = 15,
  ministryOfFinanceAndEconomicAffairs = 16,
  ríkisskattstjóri = 17,
  ríkiskaup = 18,
  sýslumaðurinnÁHöfuðborgarsvæðinu = 19,
  sýslumaðurinnÁHöfuðborgarsvæðinu2 = 50,
  theDistrictMagistrateCapitalRegion = 20,
  centralPublicProcurement = 21,
  directorateOfInternalRevenue = 22,
  sýslumaðurinnÁVestfjörðum = 23,
  theDistrictMagistrateWestfjords = 24,
  útlendingastofnun = 37,
  útlendingastofnun2 = 49,
  icelandicDirectorateOfImmigration = 38,
  utanríkisráðuneytið = 39,
  ministryForForeignAffairs = 40,
  ríkislögreglustjóri = 41,
  ríkislögreglustjóri2 = 71,
  sjúkratryggingarÍslands = 42,
  sjúkratryggingarÍslands2 = 51,
  þjóðskjalasafnÍslands = 43,
  þjóðskjalasafnÍslands2 = 44,
  sýslumenn = 53,
  fjölskylduOgHúsdýragarðurinn = 59,
  menntamálastofnun2 = 61,
  umhverfisstofnun = 62,
  héraðsdómurReykjavíkur = 63,
  minjastofnunÍslands = 64,
  náttúruhamfaratryggingarÍslands = 65,
}

export enum ApplicationTemplateStatus {
  Þýðing = -2,
  Kerfi = -1,
  Óútgefið = 0,
  Útgefið = 2,
  tekiðÚrNotkun = 4,
}

export type ButtonTypes =
  | 'CHANGE_NAME'
  | 'CHANGE_FORM_NAME'
  | 'CHANGE_DESCRIPTION'
  | 'SET_MESSAGE_WITH_LINK_SETTINGS'

type Icon =
  | 'archive'
  | 'accessibility'
  | 'add'
  | 'airplane'
  | 'arrowForward'
  | 'arrowBack'
  | 'arrowUp'
  | 'arrowDown'
  | 'attach'
  | 'business'
  | 'calculator'
  | 'calendar'
  | 'call'
  | 'car'
  | 'cardWithCheckmark'
  | 'caretDown'
  | 'caretUp'
  | 'cellular'
  | 'chatbubble'
  | 'checkmark'
  | 'checkmarkCircle'
  | 'chevronBack'
  | 'chevronUp'
  | 'chevronDown'
  | 'chevronForward'
  | 'closeCircle'
  | 'close'
  | 'copy'
  | 'document'
  | 'documents'
  | 'dots'
  | 'download'
  | 'ellipse'
  | 'ellipsisHorizontal'
  | 'ellipsisVertical'
  | 'expand'
  | 'eye'
  | 'eyeOff'
  | 'facebook'
  | 'fileTrayFull'
  | 'filter'
  | 'heart'
  | 'home'
  | 'homeWithCar'
  | 'informationCircle'
  | 'link'
  | 'location'
  | 'lockClosed'
  | 'lockOpened'
  | 'logOut'
  | 'mail'
  | 'mailOpen'
  | 'menu'
  | 'notifications'
  | 'open'
  | 'pencil'
  | 'people'
  | 'person'
  | 'playCircle'
  | 'pause'
  | 'pauseCircle'
  | 'print'
  | 'reader'
  | 'receipt'
  | 'removeCircle'
  | 'school'
  | 'search'
  | 'settings'
  | 'star'
  | 'time'
  | 'timer'
  | 'trash'
  | 'volumeHigh'
  | 'volumeMute'
  | 'wallet'
  | 'warning'
  | 'reload'
  | 'remove'
  | 'save'
  | 'bookmark'
  | 'share'
  | 'QRCode'
  | 'globe'
  | 'signLanguage'
  | 'listView'
  | 'gridView'
  | 'swapVertical'
  | 'thumbsUp'
  | 'thumbsDown'

export type InputButton = {
  label: string
  name: Icon
  onClick: () => void
}
