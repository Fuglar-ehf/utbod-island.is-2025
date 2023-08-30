// Use fallback domain in case url is relative since we just want the pathname
const FALLBACK_DOMAIN = 'https://island.is'

export const safelyExtractPathnameFromUrl = (url?: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  return new URL(url, FALLBACK_DOMAIN).pathname
}
