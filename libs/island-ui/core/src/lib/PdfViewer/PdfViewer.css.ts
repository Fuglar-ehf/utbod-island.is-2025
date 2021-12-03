import { style, globalStyle } from '@vanilla-extract/css'

export const pdfViewer = style({})

globalStyle(`${pdfViewer} svg`, {
  maxWidth: '100%',
  width: '100% !important',
  height: 'auto !important',
  border: '1px solid #CCDFFF',
})

globalStyle(`${pdfViewer} .react-pdf__Page__svg`, {
  width: 'auto !important',
})

export const linkWithoutDecorations = style({
  ':hover': {
    textDecoration: 'none',
  },
})
