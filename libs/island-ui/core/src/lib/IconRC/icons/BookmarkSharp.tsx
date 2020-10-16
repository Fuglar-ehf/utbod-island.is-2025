import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgBookmarkSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="bookmark-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M416 480L256 357.41 96 480V32h320z" />
    </svg>
  )
}

export default SvgBookmarkSharp
