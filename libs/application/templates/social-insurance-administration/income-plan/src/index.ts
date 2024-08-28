import template from './lib/IncomePlanTemplate'

export const getFields = () => import('./fields')

export const getDataProviders = () => import('./dataProviders/')
export * from './lib/messages'

export * from './lib/incomePlanUtils'
export default template
