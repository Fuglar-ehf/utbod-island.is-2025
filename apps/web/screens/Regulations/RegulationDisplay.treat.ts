import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'
const { color, typography, border } = theme

export const diffToggler = style({
  float: 'right',
  color: color.blue400,
  ':hover': {
    textDecoration: 'underline',
  },
})

// ---------------------------------------------------------------------------

export const bodyText = style({
  lineHeight: 28 / 18 + 'em',
})

const global: typeof globalStyle = (selector, styles) => {
  const B = ' ' + bodyText + ' '
  selector =
    B +
    selector
      .trim()
      .split(/\s*,\s*/)
      .filter((x) => x) // tolerate extra commas
      .join(',' + B)
  globalStyle(selector, styles)
}

global('p,ul,ol,table,blockquote', {
  marginBottom: typography.baseLineHeight + 'em',
})
global('li', {
  marginBottom: '1em',
})
global('ul,ol,blockquote', {
  marginLeft: '3em',
})
global('ul', {
  listStyle: 'disc',
})
global('ul[type="circle"]', {
  listStyle: 'circle',
})
global('ul[type="square"]', {
  listStyle: 'square',
})

global(
  `
  p:last-child,
  ul:last-child,
  ol:last-child,
  table:last-child
  `,
  {
    marginBottom: 0,
  },
)

global('table', {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
})

global('th,td', {
  padding: '0.25em 0.5em',
  minWidth: '1.5em',
  textAlign: 'left',
  verticalAlign: 'top',
  width: 'auto',
})
global(
  `
  table:not(.layout) th,
  table:not(.layout) td,
  `,
  {
    borderWidth: border.width.standard,
    borderStyle: border.style.solid,
    borderColor: color.dark300,
  },
)

global(
  `
  tr:not(:first-child) > th,
  tr:not(:first-child) > td
  `,
  {
    borderTop: '0',
  },
)
global(
  `
  tr > th:not(:first-child),
  tr > td:not(:first-child)
  `,
  {
    borderLeft: '0',
  },
)

global(`th`, {
  fontWeight: 'bold',
  backgroundColor: color.dark100,
})

global('thead tr:last-child th', {
  borderBottomWidth: border.width.large,
})
global(
  `
  tfoot tr:first-child td,
  tfoot tr:first-child th
  `,
  {
    borderTopWidth: border.width.standard,
    borderTopStyle: border.style.solid as 'solid',
    borderTopColor: color.dark300,
  },
)

global('ol:not([type])', {
  listStyle: 'decimal',
})

global('[align="right"]', {
  textAlign: 'right',
})
global('[align="center"]', {
  textAlign: 'center',
})

global('.chapter__title', {
  textAlign: 'center',
  fontSize: '1em',
})
global('.chapter__title > em', {
  display: 'block',
  fontStyle: 'inherit',
})

global('.chapter__title', {
  marginTop: '2em',
  textAlign: 'center',
  fontSize: '1em',
  lineHeight: '2em',
})
global('.chapter__title:first-child', {
  marginTop: '0',
})
global('.chapter__name', {
  display: 'block',
  fontStyle: 'inherit',
  fontWeight: typography.headingsFontWeight,
})

global(
  `
  ins.diffins,
  ins.diffmod
  `,
  {
    padding: `0 0.125em`,
    textDecorationColor: 'none',
    backgroundColor: color.mint200,
  },
)

global(
  `
  del.diffdel,
  del.diffmod
  `,
  {
    padding: `0 0.125em`,
    textDecorationColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: color.red200,
  },
)

global('.article__title', {
  marginTop: '2em',
  marginBottom: '1.5em',
  textAlign: 'center',
  fontSize: '1em',
  lineHeight: '2em',
})
global(
  `
  .article__title:first-child,
  .chapter__title + .article__title
  `,
  {
    marginTop: '0',
  },
)
global('.article__name', {
  display: 'block',
  fontStyle: 'italic',
})
