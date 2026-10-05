import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import { Chart } from '../../components/Chart';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const DATA = [
  { year: '2022', cases: 15, deaths: 0 },
  { year: '2023', cases: 12, deaths: 1 },
];

const SERIES = [
  { key: 'cases', label: '報告数' },
  { key: 'deaths', label: '死亡数' },
];

describe('Chart', () => {
  it('exposes the plot as one image named by its label', () => {
    render(
      <Chart.Line
        data={DATA}
        xKey="year"
        series={SERIES}
        label="年別の報告数"
      />,
    );
    expect(
      screen.getByRole('img', { name: '年別の報告数' }),
    ).toBeInTheDocument();
  });

  it('lists the series in an HTML legend when there are two or more', () => {
    render(<Chart.Line data={DATA} xKey="year" series={SERIES} label="年別" />);
    const legend = screen.getByRole('list');
    expect(
      within(legend)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['報告数', '死亡数']);
  });

  it('keeps a single series without a legend', () => {
    render(
      <Chart.Line
        data={DATA}
        xKey="year"
        series={SERIES.slice(0, 1)}
        label="年別"
      />,
    );
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('reveals the same data as a table behind a toggle', async () => {
    const user = userEvent.setup();
    render(
      <Chart.Bar
        data={DATA}
        xKey="year"
        xLabel="年"
        series={SERIES}
        label="年別の報告数"
      />,
    );
    const toggle = screen.getByRole('button', { name: '表で見る' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await user.click(toggle);
    const table = screen.getByRole('table', { name: '年別の報告数' });
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((th) => th.textContent),
    ).toEqual(['年', '報告数', '死亡数']);
    expect(
      within(table).getByRole('rowheader', { name: '2023' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '表を閉じる' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('shows the share of each donut slice in its table', () => {
    render(
      <Chart.Donut
        data={[
          { name: 'あり', value: 25 },
          { name: 'なし', value: 75 },
        ]}
        label="接種歴の内訳"
        showTable="always"
      />,
    );
    const table = screen.getByRole('table', { name: '接種歴の内訳' });
    expect(
      within(table).getByRole('cell', { name: '75.0%' }),
    ).toBeInTheDocument();
  });

  it('keeps the caption as the last child, where a figure may carry it', () => {
    const { container } = render(
      <Chart.Bar
        data={DATA}
        xKey="year"
        xLabel="年"
        series={SERIES}
        label="年別の報告数"
        caption="出典: サンプル値"
      />,
    );
    const figure = container.querySelector('figure');
    expect(figure?.lastElementChild?.tagName).toBe('FIGCAPTION');
    expect(figure?.lastElementChild).toHaveTextContent('出典: サンプル値');
  });

  it('names a sparkline as an image with no table', () => {
    render(<Chart.Sparkline data={[1, 2, 3]} label="過去3週の推移" />);
    expect(
      screen.getByRole('img', { name: '過去3週の推移' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
