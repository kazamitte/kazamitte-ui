import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
    ['horizontal', 'ArrowRight', '60'],
    ['horizontal', 'ArrowUp', '60'],
    ['horizontal', 'ArrowDown', '20'],
    ['horizontal', 'ArrowLeft', '20'],
    ['vertical', 'ArrowUp', '60'],
    ['vertical', 'ArrowRight', '60'],
    ['vertical', 'ArrowDown', '20'],
    ['vertical', 'ArrowLeft', '20'],
  ] as const)(
    'moves a %s slider by largeStep with Shift+%s to %s',
    async (orientation, key, expected) => {
      render(
        <Slider
          label="音量"
          orientation={orientation}
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

  it('moves only the focused thumb of a range with the cross-axis key', async () => {
    render(<Slider label="価格" defaultValue={[20, 60]} step={5} />);
    const [first, second] = screen.getAllByRole('slider', { name: '価格' });
    await userEvent.tab();
    await userEvent.tab();
    expect(second).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    expect(second).toHaveAttribute('aria-valuenow', '65');
    expect(first).toHaveAttribute('aria-valuenow', '20');
  });

  it('reports a cross-axis key through onValueChange without moving a controlled value', async () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        label="音量"
        value={[40]}
        step={5}
        onValueChange={onValueChange}
      />,
    );
    const thumb = screen.getByRole('slider', { name: '音量' });
    await userEvent.tab();
    await userEvent.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: [45] }),
    );
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
  });

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
