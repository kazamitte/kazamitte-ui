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

  it('names today and the selected day for assistive technology', async () => {
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

  it('closes on Escape and clears from the clear button', async () => {
    const user = userEvent.setup();
    renderJa(
      <DatePicker
        label="予約日"
        clearable
        defaultValue={[parseDate('2026-09-01')]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'カレンダーを開く' }));
    await screen.findByRole('grid');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());

    await user.click(screen.getByRole('button', { name: '日付を消去' }));
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: '予約日' })).toHaveValue(''),
    );
  });
});
