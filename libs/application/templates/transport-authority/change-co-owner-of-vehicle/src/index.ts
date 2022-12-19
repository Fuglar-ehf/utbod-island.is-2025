import template from './lib/ChangeCoOwnerOfVehicleTemplate'
import { ChangeCoOwnerOfVehicle } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type ChangeCoOwnerOfVehicleAnswers = ChangeCoOwnerOfVehicle

export * from './utils'
export * from './lib/messages/externalData'

export default template
