import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import { Popover } from '../../components/Popover';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const renderPopover = () =>
  render(
    <Popover.Root>
      <Popover.Trigger>共有</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Title>リンクを共有</Popover.Title>
            <Popover.Description>閲覧のみ許可します。</Popover.Description>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>,
  );

describe('Popover', () => {
  it('opens a non-modal dialog named by its title', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button', { name: '共有' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'リンクを共有' });
    expect(dialog).not.toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('閲覧のみ許可します。');
  });

  it('closes from its close button and on Escape', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: '共有' }));
    await user.click(await screen.findByRole('button', { name: '閉じる' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: '共有' }));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});
