'use client';

import { Line, LineChart as RechartsLineChart } from 'recharts';
import { CartesianFrame, type CartesianChartProps } from './CartesianFrame';
import {
  CHART_CHROME,
  seriesColor,
  seriesDash,
  useEnterDuration,
} from './chartTheme';

export const LineChart = ({ series, ...props }: CartesianChartProps) => {
  const duration = useEnterDuration();
  return (
    <CartesianFrame
      series={series}
      chart={RechartsLineChart}
      cursor={{ stroke: CHART_CHROME.axis }}
      dashedLegend
      {...props}
    >
      {series.map((entry, index) => (
        <Line
          key={entry.key}
          type="monotone"
          dataKey={entry.key}
          name={entry.label}
          stroke={seriesColor(index)}
          strokeWidth={2}
          strokeDasharray={seriesDash(index)}
          strokeLinecap="round"
          strokeLinejoin="round"
          dot={{
            r: 4,
            fill: seriesColor(index),
            stroke: CHART_CHROME.surface,
            strokeWidth: 2,
          }}
          activeDot={{ r: 6, stroke: CHART_CHROME.surface, strokeWidth: 2 }}
          isAnimationActive={duration > 1}
          animationDuration={duration}
        />
      ))}
    </CartesianFrame>
  );
};
