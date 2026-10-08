import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import { Tooltip } from '../../components/Tooltip';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

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
  it('shows the tooltip on hover and describes the trigger with it', async () => {
    const user = userEvent.setup();
    renderTooltip();
    const trigger = screen.getByRole('button', { name: '設定' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(trigger);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('通知やテーマを変更します');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('hides the tooltip when the pointer leaves the trigger', async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.hover(screen.getByRole('button', { name: '設定' }));
    await screen.findByRole('tooltip');

    await user.unhover(screen.getByRole('button', { name: '設定' }));
    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(),
    );
  });

  it('shows on keyboard focus and hides on Escape', async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.tab();
    expect(screen.getByRole('button', { name: '設定' })).toHaveFocus();
    await screen.findByRole('tooltip');

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(),
    );
  });
});
