import flatten from 'lodash/flatten'

export const createTerms = (termStrings: string[]): string[] => {
  const singleWords = termStrings.map((termString = '') => {
    const words = termString
      .toLowerCase()
      .replace(/[^a-záðéíóúýþæö]+/g, ' ') // remove all non characters
      .split(/\s+/)
    return words
  })
  return flatten(singleWords).filter((word) => word.length > 1) // fitler out 1 letter words and empty string
}

export const extractStringsFromObject = (
  contentObject: object,
  maxDepth = 100,
): string => {
  // we have reached the max depth in the object
  if (maxDepth === 0) {
    return ''
  }
  return Object.values(contentObject).reduce((contentString, content) => {
    if (Array.isArray(content)) {
      // lets extract string from nested arrays
      return (
        contentString + extractStringsFromObject({ ...content }, maxDepth - 1)
      )
    } else if (content && typeof content === 'object') {
      // lets extract string from nested objects
      return contentString + extractStringsFromObject(content, maxDepth - 1)
    } else if (typeof content === 'string') {
      try {
        const parsedContent = JSON.parse(content)
        return (
          contentString + extractStringsFromObject(parsedContent, maxDepth - 1)
        )
      } catch (e) {
        // we only consider string of more than 3 words valid content strings
        if (content.split(' ').length > 3) {
          return `${contentString} ${content}`
        }
      }
    }
    return contentString
  }, '')
}

const getEntriesByTypeName = (contentList: any[], typename: string) =>
  contentList.filter((content) => content.typename === typename)

const getAssetsByContentType = (contentList: object[], contentType: string) => {
  const assets = getEntriesByTypeName(contentList, 'Asset')
  return assets.filter((asset) => asset.contentType === contentType)
}

export const numberOfLinks = (contentList: object[]) => ({
  fillAndSignLinks: getEntriesByTypeName(
    contentList,
    'ProcessEntry',
  ).filter((entry) => entry.processLink.includes('dropandsign.is')).length,
  pdfLinks: getAssetsByContentType(contentList, 'application/pdf').length,
  wordLinks: getAssetsByContentType(contentList, 'application/msword').length,
})

export const hasProcessEntry = (contentList: any[]) =>
  getEntriesByTypeName(contentList, 'ProcessEntry').length !== 0
