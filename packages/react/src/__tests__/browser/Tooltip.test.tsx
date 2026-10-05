import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Tooltip } from '../../components/Tooltip';

const renderTooltip = () =>
  render(
    <Tooltip.Root openDelay={0} closeDelay={0}>
      <Tooltip.Trigger>設定</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>
            <Tooltip.Arrow />
            通知やテーマを変更します
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>,
  );

describe('Tooltip', () => {
  it('shows a visible, positioned tooltip on keyboard focus of the trigger', async () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: '設定' });

    await userEvent.keyboard('{Tab}');
    expect(trigger).toHaveFocus();

    const tooltip = await screen.findByRole('tooltip');
    await waitFor(() => expect(tooltip).toBeVisible());
    const rect = tooltip.getBoundingClientRect();
    expect(rect.width).toBeGreaterThan(0);
    expect(rect.height).toBeGreaterThan(0);
  });

  it('describes the trigger with the visible tooltip while it is open', async () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: '設定' });

    await userEvent.keyboard('{Tab}');
    const tooltip = await screen.findByRole('tooltip');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    expect(document.getElementById(tooltip.id)).toBe(tooltip);
  });

  it('hides the tooltip on Escape', async () => {
    renderTooltip();
    await userEvent.keyboard('{Tab}');
    await screen.findByRole('tooltip');

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('tooltip')).toBeNull();
  });
});
