'use client';

import { Bar, BarChart as RechartsBarChart } from 'recharts';
import { CartesianFrame, type CartesianChartProps } from './CartesianFrame';
import { CHART_CHROME, seriesColor, useEnterDuration } from './chartTheme';

export type BarChartProps = CartesianChartProps & {
  stacked?: boolean;
};

export const BarChart = ({
  series,
  stacked = false,
  ...props
}: BarChartProps) => {
  const duration = useEnterDuration();
  return (
    <CartesianFrame
      series={series}
      chart={RechartsBarChart}
      chartProps={{ barCategoryGap: '30%', barGap: 2 }}
      cursor={{ fill: CHART_CHROME.grid, fillOpacity: 0.5 }}
      {...props}
    >
      {series.map((entry, index) => (
        <Bar
          key={entry.key}
          dataKey={entry.key}
          name={entry.label}
          fill={seriesColor(index)}
          stackId={stacked ? 'stack' : undefined}
          maxBarSize={24}
          radius={stacked && index < series.length - 1 ? 0 : [4, 4, 0, 0]}
          stroke={stacked ? CHART_CHROME.surface : undefined}
          strokeWidth={stacked ? 1 : 0}
          isAnimationActive={duration > 1}
          animationDuration={duration}
        />
      ))}
    </CartesianFrame>
  );
};
