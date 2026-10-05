import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NumberInput } from '../../components/NumberInput';

describe('NumberInput', () => {
  it('renders a spinbutton named by the label with Japanese stepper buttons', () => {
    render(<NumberInput label="数量" defaultValue="3" min={0} max={10} />);
    const input = screen.getByRole('spinbutton', { name: '数量' });
    expect(input).toHaveValue('3');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '10');
    expect(screen.getByRole('button', { name: '増やす' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '減らす' })).toBeInTheDocument();
  });

  it('steps the value with the buttons and the arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberInput
        label="数量"
        defaultValue="1"
        step={2}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: '数量' });
    await user.click(screen.getByRole('button', { name: '増やす' }));
    await waitFor(() => expect(input).toHaveValue('3'));
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: '3', valueAsNumber: 3 }),
    );

    await user.click(input);
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(input).toHaveValue('1'));
  });

  it('clamps a typed value into the min/max range on blur', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="数量" min={0} max={10} />);
    const input = screen.getByRole('spinbutton', { name: '数量' });
    await user.type(input, '42');
    await user.tab();
    await waitFor(() => expect(input).toHaveValue('10'));
  });

  it('formats the value through formatOptions', async () => {
    render(
      <NumberInput
        label="価格"
        defaultValue="1200"
        locale="ja-JP"
        formatOptions={{ style: 'currency', currency: 'JPY' }}
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole('spinbutton', { name: '価格' })).toHaveValue(
        '￥1,200',
      ),
    );
  });

  it('marks the input invalid and disables the whole control', () => {
    render(<NumberInput label="数量" invalid disabled />);
    const input = screen.getByRole('spinbutton', { name: '数量' });
    expect(input).toBeInvalid();
    expect(input).toBeDisabled();
    expect(screen.getByRole('button', { name: '増やす' })).toBeDisabled();
  });
});
