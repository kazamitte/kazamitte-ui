import type { ReactElement } from 'react';
import { LocaleProvider } from '@ark-ui/react/locale';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { DatePicker, parseDate } from '../../components/DatePicker';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const renderJa = (ui: ReactElement) =>
  render(<LocaleProvider locale="ja-JP">{ui}</LocaleProvider>);

describe('DatePicker', { timeout: 15000 }, () => {
  it('opens a calendar from the trigger and picks a day', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderJa(
      <DatePicker
        label="予約日"
        defaultValue={[parseDate('2026-09-01')]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'カレンダーを開く' }));
    const grid = await screen.findByRole('grid');
    await user.click(
      within(grid).getByRole('button', { name: /2026年9月15日/ }),
    );
    const details = onValueChange.mock.lastCall?.[0] as {
      value: { toString: () => string }[];
    };
    expect(details.value.map((date) => date.toString())).toEqual([
      '2026-09-15',
    ]);
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: '予約日' })).toHaveValue(
        '2026/09/15',
      ),
    );
  });

  it('names the selected day for assistive technology', async () => {
    const user = userEvent.setup();
    renderJa(
      <DatePicker label="予約日" defaultValue={[parseDate('2026-09-01')]} />,
    );
    await user.click(screen.getByRole('button', { name: 'カレンダーを開く' }));
    const grid = await screen.findByRole('grid');
    expect(
      within(grid).getByRole('button', { name: /2026年9月1日.*、選択中/ }),
    ).toBeInTheDocument();
  });

  it('names today with （今日） in the calendar', async () => {
    vi.useFakeTimers({
      toFake: ['Date'],
      now: new Date('2026-09-10T03:00:00Z'),
    });
    try {
      const user = userEvent.setup();
      renderJa(<DatePicker label="予約日" />);
      await user.click(
        screen.getByRole('button', { name: 'カレンダーを開く' }),
      );
      const grid = await screen.findByRole('grid');
      expect(
        within(grid).getByRole('button', { name: /2026年9月10日.*（今日）/ }),
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('labels the month navigation and the view switch in Japanese', async () => {
    const user = userEvent.setup();
    renderJa(
      <DatePicker label="予約日" defaultValue={[parseDate('2026-09-01')]} />,
    );
    await user.click(screen.getByRole('button', { name: 'カレンダーを開く' }));
    await screen.findByRole('grid');
    expect(screen.getByRole('button', { name: '前の月' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '次の月' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '月の一覧へ' }));
    expect(await screen.findByRole('button', { name: '前の年' })).toBeVisible();
    expect(screen.getByRole('button', { name: '次の年' })).toBeVisible();
    expect(screen.getByRole('button', { name: '年の一覧へ' })).toBeVisible();
  });

  it('has no clear button unless clearable', () => {
    renderJa(
      <DatePicker label="予約日" defaultValue={[parseDate('2026-09-01')]} />,
    );
    expect(
      screen.queryByRole('button', { name: '日付を消去' }),
    ).not.toBeInTheDocument();
  });

  it('clears the value from the clear button', async () => {
    const user = userEvent.setup();
    renderJa(
      <DatePicker
        label="予約日"
        clearable
        defaultValue={[parseDate('2026-09-01')]}
      />,
    );
    await user.click(screen.getByRole('button', { name: '日付を消去' }));
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: '予約日' })).toHaveValue(''),
    );
  });

  it('shows a start and an end field in range mode', () => {
    renderJa(<DatePicker label="期間" selectionMode="range" />);
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  it('lets a translations override rename one control and keeps the other defaults', () => {
    renderJa(
      <DatePicker
        label="予約日"
        clearable
        defaultValue={[parseDate('2026-09-01')]}
        translations={{ trigger: () => 'Open calendar' }}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Open calendar' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '日付を消去' }),
    ).toBeInTheDocument();
  });
});
