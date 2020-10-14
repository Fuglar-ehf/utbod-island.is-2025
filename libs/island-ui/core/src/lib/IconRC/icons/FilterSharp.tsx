import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgFilterSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="filter-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 120h480v48H16zm80 112h320v48H96zm96 112h128v48H192z" />
    </svg>
  )
}

export default SvgFilterSharp
