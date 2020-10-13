import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgBookmarksSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="bookmarks-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M112 0v48h304v368l48 32V0H112z" />
      <path d="M48 80v432l168-124 168 124V80H48z" />
    </svg>
  )
}

export default SvgBookmarksSharp
