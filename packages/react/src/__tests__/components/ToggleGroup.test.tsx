import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
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

  it('keeps the checked radio checked when it is clicked again', async () => {
    const user = userEvent.setup();
    render(<ToggleGroup items={ITEMS} defaultValue={['bold']} />);
    const bold = screen.getByRole('radio', { name: '太字' });
    await user.click(bold);
    expect(bold).toHaveAttribute('aria-checked', 'true');
  });

  it('lets the checked item be cleared when deselectable', async () => {
    const user = userEvent.setup();
    render(<ToggleGroup items={ITEMS} defaultValue={['bold']} deselectable />);
    const bold = screen.getByRole('radio', { name: '太字' });
    await user.click(bold);
    expect(bold).toHaveAttribute('aria-checked', 'false');
  });
});
