import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Select } from '../../components/Select';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const ITEMS = [
  { value: 'tokyo', label: '東京都' },
  { value: 'osaka', label: '大阪府' },
  { value: 'okinawa', label: '沖縄県', disabled: true },
];

describe('Select', () => {
  it('renders a combobox button named by the label showing the placeholder', () => {
    render(<Select label="都道府県" items={ITEMS} />);
    const trigger = screen.getByRole('combobox', { name: '都道府県' });
    expect(trigger).toHaveTextContent('選択してください');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows a custom placeholder', () => {
    render(<Select label="都道府県" items={ITEMS} placeholder="未選択" />);
    expect(
      screen.getByRole('combobox', { name: '都道府県' }),
    ).toHaveTextContent('未選択');
  });

  it('marks the chosen option as selected when reopened', async () => {
    const user = userEvent.setup();
    render(<Select label="都道府県" items={ITEMS} defaultValue={['osaka']} />);
    await user.click(screen.getByRole('combobox', { name: '都道府県' }));
    expect(
      await screen.findByRole('option', { name: '大阪府' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: '東京都' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('opens a listbox, selects an option and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select label="都道府県" items={ITEMS} onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('combobox', { name: '都道府県' }));
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeVisible();
    expect(screen.getByRole('option', { name: '沖縄県' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    await user.click(screen.getByRole('option', { name: '大阪府' }));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: ['osaka'] }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('combobox', { name: '都道府県' }),
      ).toHaveTextContent('大阪府'),
    );
  });

  it('lists grouped items under their group labels', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="地域"
        items={[
          { value: 'tokyo', label: '東京都', group: '関東' },
          { value: 'osaka', label: '大阪府', group: '関西' },
        ]}
      />,
    );
    await user.click(screen.getByRole('combobox', { name: '地域' }));
    expect(await screen.findByRole('group', { name: '関東' })).toContainElement(
      screen.getByRole('option', { name: '東京都' }),
    );
    expect(screen.getByRole('group', { name: '関西' })).toContainElement(
      screen.getByRole('option', { name: '大阪府' }),
    );
  });

  it('lists ungrouped items without an empty group heading when mixed with grouped ones', async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="地域"
        items={[
          { value: 'tokyo', label: '東京都', group: '関東' },
          { value: 'okinawa', label: '沖縄県' },
        ]}
      />,
    );
    await user.click(screen.getByRole('combobox', { name: '地域' }));
    expect(
      await screen.findByRole('group', { name: '関東' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '沖縄県' })).toBeInTheDocument();
    expect(screen.queryAllByRole('group')).toHaveLength(1);
  });

  it('carries the value in a hidden select for forms', () => {
    const { container } = render(
      <form>
        <Select name="pref" items={ITEMS} defaultValue={['tokyo']} />
      </form>,
    );
    const form = container.querySelector('form');
    if (form === null) throw new Error('form not rendered');
    expect(new FormData(form).get('pref')).toBe('tokyo');
  });
});
