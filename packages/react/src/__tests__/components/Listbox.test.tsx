import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Listbox } from '../../components/Listbox';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const ITEMS = [
  { value: 'tokyo', label: '東京都' },
  { value: 'osaka', label: '大阪府' },
  { value: 'okinawa', label: '沖縄県', disabled: true },
];

describe('Listbox', () => {
  it('renders a listbox named by the label with its options always visible', () => {
    render(<Listbox label="都道府県" items={ITEMS} />);
    const listbox = screen.getByRole('listbox', { name: '都道府県' });
    expect(listbox).toBeVisible();
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: '沖縄県' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('selects an option on click and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Listbox label="都道府県" items={ITEMS} onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('option', { name: '大阪府' }));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: ['osaka'] }),
    );
    expect(screen.getByRole('option', { name: '大阪府' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('keeps several options selected in multiple mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Listbox
        label="都道府県"
        items={ITEMS}
        selectionMode="multiple"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('option', { name: '東京都' }));
    await user.click(screen.getByRole('option', { name: '大阪府' }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: ['tokyo', 'osaka'] }),
    );
    expect(screen.getByRole('listbox')).toHaveAttribute(
      'aria-multiselectable',
      'true',
    );
  });

  it('moves the highlight with the arrow keys and selects with Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Listbox label="都道府県" items={ITEMS} onValueChange={onValueChange} />,
    );
    await user.tab();
    expect(screen.getByRole('listbox')).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('option', { name: '大阪府' })).toHaveAttribute(
        'data-highlighted',
      ),
    );
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: ['osaka'] }),
    );
  });

  it('lists grouped items under their group labels', () => {
    render(
      <Listbox
        label="地域"
        items={[
          { value: 'tokyo', label: '東京都', group: '関東' },
          { value: 'osaka', label: '大阪府', group: '関西' },
        ]}
      />,
    );
    expect(screen.getByRole('group', { name: '関東' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '関西' })).toBeInTheDocument();
  });

  it('lists ungrouped items without an empty group heading when mixed with grouped ones', () => {
    render(
      <Listbox
        label="地域"
        items={[
          { value: 'tokyo', label: '東京都', group: '関東' },
          { value: 'okinawa', label: '沖縄県' },
        ]}
      />,
    );
    expect(screen.getByRole('group', { name: '関東' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '沖縄県' })).toBeInTheDocument();
    expect(screen.queryAllByRole('group')).toHaveLength(1);
  });

  it('follows a controlled value', () => {
    render(<Listbox label="都道府県" items={ITEMS} value={['tokyo']} />);
    expect(screen.getByRole('option', { name: '東京都' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
