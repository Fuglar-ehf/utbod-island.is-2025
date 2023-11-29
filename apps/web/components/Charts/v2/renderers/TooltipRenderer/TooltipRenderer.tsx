import { Tooltip, TooltipProps } from 'recharts'

import { theme } from '@island.is/island-ui/theme'
import { useI18n } from '@island.is/web/i18n'

import { formatValueForPresentation } from '../../utils'
import * as style from './TooltipRenderer.css'

export const CustomTooltipRenderer = (props: TooltipProps<string, number>) => {
  const { active, payload } = props
  const isActive = active && payload && payload.length

  const { activeLocale } = useI18n()

  if (!isActive) {
    return null
  }

  return (
    <ul className={style.list}>
      {payload.map((item) => {
        let labelColor =
          (item as any)?.stroke ?? item?.payload?.stroke ?? theme.color.dark400

        if (labelColor === 'white' || labelColor === '#fff') {
          labelColor = theme.color.dark400
        }

        return (
          <li>
            <span
              style={{
                color: labelColor,
              }}
            >
              {item.name}
            </span>
            :{' '}
            {item.value
              ? formatValueForPresentation(activeLocale, item.value, false)
              : ''}
          </li>
        )
      })}
    </ul>
  )
}

export const renderTooltip = (props: any) => {
  return (
    <Tooltip
      cursor={{
        fill: '#ccc',
        fillOpacity: 0.15,
      }}
      content={CustomTooltipRenderer}
    />
  )
}
