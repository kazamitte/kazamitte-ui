'use client';

import type { ComponentProps, ComponentType, ReactNode } from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarChart as RechartsBarChart,
} from 'recharts';
import {
  ChartFrame,
  ChartTooltip,
  seriesLegend,
  seriesTable,
  type ChartDatum,
  type ChartFrameProps,
  type ChartSeries,
} from './ChartFrame';
import { CHART_CHROME } from './chartTheme';

export type CartesianChartProps = Omit<
  ChartFrameProps,
  'children' | 'legend' | 'table'
> & {
  data: ChartDatum[];
  xKey: string;
  xLabel?: string;
  series: ChartSeries[];
  formatValue?: (value: number) => string;
};

const axisProps = {
  stroke: CHART_CHROME.axis,
  tick: { fill: CHART_CHROME.text, fontSize: 12 },
  tickLine: false,
} as const;

type RechartsChartProps = ComponentProps<typeof RechartsBarChart>;

type CartesianFrameProps = CartesianChartProps & {
  chart: ComponentType<RechartsChartProps>;
  chartProps?: Omit<RechartsChartProps, 'data' | 'margin' | 'children'>;
  cursor: ComponentProps<typeof Tooltip>['cursor'];
  dashedLegend?: boolean;
  children: ReactNode;
};

export const CartesianFrame = ({
  data,
  xKey,
  xLabel = xKey,
  series,
  formatValue,
  chart: Chart,
  chartProps,
  cursor,
  dashedLegend,
  children,
  ...frame
}: CartesianFrameProps) => (
  <ChartFrame
    legend={seriesLegend(series, { dashed: dashedLegend })}
    table={seriesTable(data, xKey, xLabel, series)}
    {...frame}
  >
    <ResponsiveContainer width="100%" height="100%">
      <Chart
        data={data}
        margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
        {...chartProps}
      >
        <CartesianGrid stroke={CHART_CHROME.grid} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis
          {...axisProps}
          axisLine={false}
          width={48}
          tickFormatter={formatValue}
        />
        <Tooltip
          cursor={cursor}
          content={<ChartTooltip formatValue={formatValue} />}
        />
        {children}
      </Chart>
    </ResponsiveContainer>
  </ChartFrame>
);
