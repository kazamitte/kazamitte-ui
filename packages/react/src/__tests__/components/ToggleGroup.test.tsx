import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { SegmentGroup } from '../../components/SegmentGroup';
import { ToggleGroup } from '../../components/ToggleGroup';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const ITEMS = [
  { value: 'bold', label: '太字' },
  { value: 'italic', label: '斜体' },
  { value: 'underline', label: '下線', disabled: true },
];

describe('ToggleGroup', () => {
  it('presses several items independently when multiple', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup items={ITEMS} multiple onValueChange={onValueChange} />,
    );
    const bold = screen.getByRole('button', { name: '太字' });
    expect(bold).toHaveAttribute('aria-pressed', 'false');

    await user.click(bold);
    await user.click(screen.getByRole('button', { name: '斜体' }));
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith({
      value: ['bold', 'italic'],
    });
    expect(screen.getByRole('button', { name: '下線' })).toBeDisabled();
  });

  it('acts as a radio group when single', async () => {
    const user = userEvent.setup();
    render(<ToggleGroup items={ITEMS} defaultValue={['bold']} />);
    expect(screen.getByRole('radio', { name: '太字' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await user.click(screen.getByRole('radio', { name: '斜体' }));
    expect(screen.getByRole('radio', { name: '太字' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });
});

describe('SegmentGroup', () => {
  const OPTIONS = [
    { value: 'list', label: 'リスト' },
    { value: 'grid', label: 'グリッド' },
  ];

  it('is a radio group named by the label whose radios select on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentGroup
        label="表示形式"
        options={OPTIONS}
        defaultValue="list"
        onValueChange={onValueChange}
      />,
    );
    expect(
      screen.getByRole('radiogroup', { name: '表示形式' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'リスト' })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'グリッド' }));
    expect(onValueChange).toHaveBeenCalledWith({ value: 'grid' });
    expect(screen.getByRole('radio', { name: 'グリッド' })).toBeChecked();
  });
});
