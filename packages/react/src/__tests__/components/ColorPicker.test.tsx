import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ColorPicker, parseColor } from '../../components/ColorPicker';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

describe('ColorPicker', () => {
  it('shows the hex value in a field and a named swatch button', () => {
    render(
      <ColorPicker label="テーマ色" defaultValue={parseColor('#ca3500')} />,
    );
    expect(screen.getByRole('textbox', { name: '16進数の色' })).toHaveValue(
      '#CA3500',
    );
    expect(
      screen.getByRole('button', { name: '色を選ぶ' }),
    ).toBeInTheDocument();
  });

  it('accepts a typed hex value and reports the color', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ColorPicker
        label="テーマ色"
        defaultValue={parseColor('#000000')}
        onValueChange={onValueChange}
      />,
    );
    const field = screen.getByRole('textbox', { name: '16進数の色' });
    await user.clear(field);
    await user.type(field, '#0069A8{Enter}');
    const details = onValueChange.mock.lastCall?.[0] as {
      value: { toString: (format: string) => string };
    };
    expect(details.value.toString('hex').toLowerCase()).toBe('#0069a8');
  });

  it('opens the picker with labelled sliders and preset swatches', async () => {
    const user = userEvent.setup();
    render(
      <ColorPicker
        label="テーマ色"
        alpha
        presets={['#ca3500', '#0069a8']}
        defaultValue={parseColor('#ca3500')}
      />,
    );
    await user.click(screen.getByRole('button', { name: '色を選ぶ' }));
    expect(
      await screen.findByRole('slider', { name: '色相' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('slider', { name: '不透明度' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#0069a8' })).toBeInTheDocument();
  });
});
