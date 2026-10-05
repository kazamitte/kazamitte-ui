import type { ReactElement } from 'react';
import { LocaleProvider } from '@ark-ui/react/locale';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateInput } from '../../components/DateInput';
import { parseDate } from '../../components/DatePicker';

const renderJa = (ui: ReactElement) =>
  render(<LocaleProvider locale="ja-JP">{ui}</LocaleProvider>);

describe('DateInput', () => {
  it('renders a labelled group of year, month and day segments', () => {
    renderJa(
      <DateInput
        label="生年月日"
        name="birthday"
        defaultValue={[parseDate('1990-04-01')]}
      />,
    );
    const group = screen.getByRole('group', { name: '生年月日' });
    expect(within(group).getAllByRole('spinbutton')).toHaveLength(3);
    expect(document.querySelector('input[name="birthday"]')).toHaveValue(
      '1990/04/01',
    );
  });

  it('changes a segment with the arrow keys and reports the date', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderJa(
      <DateInput
        label="生年月日"
        defaultValue={[parseDate('1990-04-01')]}
        onValueChange={onValueChange}
      />,
    );
    const [year] = screen.getAllByRole('spinbutton');
    await user.click(year);
    await user.keyboard('{ArrowUp}');
    const details = onValueChange.mock.lastCall?.[0] as {
      value: { toString: () => string }[];
    };
    expect(details.value.map((date) => date.toString())).toEqual([
      '1991-04-01',
    ]);
  });

  it('renders two fields for a range', () => {
    renderJa(<DateInput label="期間" selectionMode="range" />);
    expect(screen.getAllByRole('spinbutton')).toHaveLength(6);
    expect(screen.getByText('〜')).toBeInTheDocument();
  });
});
