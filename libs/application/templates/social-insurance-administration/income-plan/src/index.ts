import template from './lib/IncomePlanTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')
export * from './lib/messages'

export default template
