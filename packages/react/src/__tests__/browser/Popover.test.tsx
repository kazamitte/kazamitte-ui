import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Popover } from '../../components/Popover';

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
  it('moves real focus into the popover when it opens', async () => {
    renderPopover();
    await userEvent.click(screen.getByRole('button', { name: '共有' }));
    const dialog = await screen.findByRole('dialog');
    await expect.poll(() => dialog.contains(document.activeElement)).toBe(true);
  });

  it('returns real focus to the trigger after closing with Escape', async () => {
    renderPopover();
    const trigger = screen.getByRole('button', { name: '共有' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog');

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });
});
