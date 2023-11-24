import { Area, Bar, Cell, Label, Line, Pie } from 'recharts'

import type { Locale } from '@island.is/shared/types'

import { PREDEFINED_LINE_DASH_PATTERNS } from '../constants'
import {
  ChartComponentType,
  ChartComponentWithRenderProps,
  ChartData,
  ChartType,
} from '../types'
import { formatValueForPresentation } from '../utils'

interface ChartComponentRendererProps {
  component: ChartComponentWithRenderProps
}

export const renderChartComponent = ({
  component,
}: ChartComponentRendererProps) => {
  const commonProps = {
    dataKey: component.sourceDataKey,
    name: component.label,
    isAnimationActive: false,
  }

  if (component.type === ChartComponentType.bar) {
    return (
      <Bar
        {...commonProps}
        fill={component.fill}
        radius={component.shouldRenderBorderRadius ? [6, 6, 0, 0] : undefined}
        barSize={25}
        stackId={component.stackId?.toString()}
        stroke={component.color}
        color={component.color}
      />
    )
  } else if (component.type === ChartComponentType.line) {
    return (
      <Line
        {...commonProps}
        stroke={component.color}
        strokeWidth={3}
        strokeDasharray={
          component.renderIndex === 0
            ? undefined // First line is solid
            : PREDEFINED_LINE_DASH_PATTERNS[component.renderIndex - 1] // The rest gets a pattern
        }
      />
    )
  } else if (component.type === ChartComponentType.area) {
    return <Area {...commonProps} fill={component.fill} fillOpacity={1} />
  }

  return null
}

type CustomLabelProps = {
  cx: number
  cy: number
  midAngle: number
  outerRadius: number
  innerRadius: number
  percent: number
  payload?: {
    name?: string
    value?: string | number
  }
  activeLocale: Locale
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  innerRadius,
  payload,
  activeLocale,
}: CustomLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  const value = payload?.value

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="#00003C"
        textAnchor={x > outerRadius ? 'middle' : 'end'}
        dominantBaseline="central"
        fontSize="12px"
        fontWeight={500}
      >
        {`${value ? formatValueForPresentation(activeLocale, value) : ''}`}{' '}
        {payload?.name?.toLowerCase()}
      </text>
    </g>
  )
}

export const renderPieChartComponents = (
  components: ChartComponentWithRenderProps[],
  data: ChartData,
  activeLocale: Locale,
) => {
  const pieData = data?.[0]?.statisticsForDate

  return (
    <Pie
      data={pieData}
      dataKey="value"
      isAnimationActive={false}
      cx="50%"
      cy="50%"
      innerRadius="30%"
      outerRadius="60%"
      label={(props) =>
        renderCustomizedLabel({
          ...props,
          activeLocale,
        })
      }
      startAngle={90}
      endAngle={360 + 90}
    >
      <Label
        fontSize={24}
        fontWeight="bold"
        value={pieData.reduce(
          (total, { value }) => total + (value ? value : 0),
          0,
        )}
        position="center"
      />
      {components.map((c, i) => (
        <Cell
          key={i}
          fill={c.fill}
          name={c.label}
          stroke="white"
          strokeWidth={3}
        />
      ))}
    </Pie>
  )
}

interface ChartComponentsRendererProps {
  componentsWithAddedProps: ChartComponentWithRenderProps[]
  chartType: ChartType
  data: ChartData
  activeLocale: Locale
}

export const renderChartComponents = ({
  componentsWithAddedProps,
  chartType,
  data,
  activeLocale,
}: ChartComponentsRendererProps) => {
  if (chartType === ChartType.pie) {
    return renderPieChartComponents(
      componentsWithAddedProps,
      data,
      activeLocale,
    )
  }

  return componentsWithAddedProps.map((component) =>
    renderChartComponent({
      component,
    }),
  )
}
