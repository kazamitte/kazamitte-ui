import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Slider } from '../../components/Slider';

describe('Slider', () => {
  it.each([
    ['horizontal', 'ArrowRight', '45'],
    ['horizontal', 'ArrowUp', '45'],
    ['horizontal', 'ArrowLeft', '35'],
    ['horizontal', 'ArrowDown', '35'],
    ['vertical', 'ArrowUp', '45'],
    ['vertical', 'ArrowRight', '45'],
    ['vertical', 'ArrowDown', '35'],
    ['vertical', 'ArrowLeft', '35'],
  ] as const)(
    'moves a %s slider with a real %s key press to %s',
    async (orientation, key, expected) => {
      render(
        <Slider
          label="音量"
          orientation={orientation}
          defaultValue={[40]}
          min={0}
          max={80}
          step={5}
        />,
      );
      const thumb = screen.getByRole('slider', { name: '音量' });
      await userEvent.tab();
      expect(thumb).toHaveFocus();

      await userEvent.keyboard(`{${key}}`);
      expect(thumb).toHaveAttribute('aria-valuenow', expected);
    },
  );

  it.each([
    ['ArrowRight', '60'],
    ['ArrowUp', '60'],
  ] as const)(
    'moves by largeStep with Shift+%s on a horizontal slider',
    async (key, expected) => {
      render(
        <Slider
          label="音量"
          defaultValue={[40]}
          min={0}
          max={80}
          step={5}
          largeStep={20}
        />,
      );
      const thumb = screen.getByRole('slider', { name: '音量' });
      await userEvent.tab();
      await userEvent.keyboard(`{Shift>}{${key}}{/Shift}`);
      expect(thumb).toHaveAttribute('aria-valuenow', expected);
    },
  );

  it('jumps to the minimum on a real Home key press', async () => {
    render(
      <Slider label="音量" defaultValue={[40]} min={0} max={80} step={5} />,
    );
    const thumb = screen.getByRole('slider', { name: '音量' });
    await userEvent.tab();
    await userEvent.keyboard('{Home}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
  });

  it('jumps to the maximum on a real End key press', async () => {
    render(
      <Slider label="音量" defaultValue={[40]} min={0} max={80} step={5} />,
    );
    const thumb = screen.getByRole('slider', { name: '音量' });
    await userEvent.tab();
    await userEvent.keyboard('{End}');
    expect(thumb).toHaveAttribute('aria-valuenow', '80');
  });
});
