import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Select } from '../../components/Select';

const ITEMS = [
  { value: 'tokyo', label: '東京都' },
  { value: 'osaka', label: '大阪府' },
  { value: 'okinawa', label: '沖縄県' },
];

const LATIN_ITEMS = [
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'osaka', label: 'Osaka' },
  { value: 'okinawa', label: 'Okinawa' },
];

describe('Select', () => {
  it('opens the listbox with ArrowDown after tabbing to the trigger', async () => {
    render(<Select label="都道府県" items={ITEMS} />);
    const trigger = screen.getByRole('combobox', { name: '都道府県' });
    await userEvent.keyboard('{Tab}');
    expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const listbox = await screen.findByRole('listbox');
    await expect.poll(() => listbox).toBeVisible();
  });

  it('moves the active option with arrow keys and chooses it with Enter', async () => {
    const trigger = await renderAndFocusOpen();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect.poll(() => trigger.textContent).toContain('大阪府');
  });

  it('returns real focus to the trigger after choosing an option', async () => {
    const trigger = await renderAndFocusOpen();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect.poll(() => screen.queryByRole('listbox')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('jumps to and chooses the option matching a typed letter (typeahead)', async () => {
    const trigger = await renderAndFocusOpen(LATIN_ITEMS);
    const listbox = await screen.findByRole('listbox');
    await userEvent.keyboard('o');
    await expect
      .poll(() => listbox.querySelector('[data-highlighted]')?.textContent)
      .toBe('Osaka');
    await userEvent.keyboard('{Enter}');
    await expect.poll(() => trigger.textContent).toContain('Osaka');
  });
});

const renderAndFocusOpen = async (items = ITEMS) => {
  render(<Select label="都道府県" items={items} />);
  const trigger = screen.getByRole('combobox', { name: '都道府県' });
  await userEvent.click(trigger);
  await screen.findByRole('listbox');
  return trigger;
};
