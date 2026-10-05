import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../../components/Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox labelled by the label prop', () => {
    render(<Checkbox label="規約に同意する" />);
    expect(
      screen.getByRole('checkbox', { name: '規約に同意する' }),
    ).toBeInTheDocument();
  });

  it('is labelled by aria-label when there is no visible label', () => {
    render(<Checkbox aria-label="このページの行をすべて選択" />);
    expect(
      screen.getByRole('checkbox', { name: 'このページの行をすべて選択' }),
    ).toBeInTheDocument();
  });

  it('forwards onCheckedChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="同意" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('checkbox', { name: '同意' }));
    expect(onCheckedChange).toHaveBeenCalledWith({ checked: true });
  });

  it('forwards the disabled state', () => {
    render(<Checkbox label="無効" disabled />);
    expect(screen.getByRole('checkbox', { name: '無効' })).toBeDisabled();
  });
});
