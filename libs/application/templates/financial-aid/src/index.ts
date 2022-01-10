import ApplicationTemplatesFinancialAid from './lib/application-templates-financial-aid'

export * from './lib/application-templates-financial-aid'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export * from './lib/types'

export default ApplicationTemplatesFinancialAid
