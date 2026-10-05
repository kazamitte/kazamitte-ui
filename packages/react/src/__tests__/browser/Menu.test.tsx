import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Menu } from '../../components/Menu';

const renderMenu = () =>
  render(
    <Menu.Root>
      <Menu.Trigger>操作</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="edit">編集</Menu.Item>
            <Menu.Item value="duplicate">複製</Menu.Item>
            <Menu.Item value="delete">削除</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>,
  );

describe('Menu', () => {
  it('opens from the keyboard with Enter and highlights the first item', async () => {
    renderMenu();
    const trigger = screen.getByRole('button', { name: '操作' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');

    await screen.findByRole('menu');
    await expect
      .poll(() => screen.getByRole('menuitem', { name: '編集' }))
      .toHaveAttribute('data-highlighted');
  });

  it('opens from the keyboard with ArrowDown and highlights the first item', async () => {
    renderMenu();
    const trigger = screen.getByRole('button', { name: '操作' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');

    await screen.findByRole('menu');
    await expect
      .poll(() => screen.getByRole('menuitem', { name: '編集' }))
      .toHaveAttribute('data-highlighted');
  });

  it('moves the highlight with the arrow keys', async () => {
    renderMenu();
    const trigger = screen.getByRole('button', { name: '操作' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('menu');

    await userEvent.keyboard('{ArrowDown}');
    await expect
      .poll(() => screen.getByRole('menuitem', { name: '複製' }))
      .toHaveAttribute('data-highlighted');

    await userEvent.keyboard('{ArrowUp}');
    await expect
      .poll(() => screen.getByRole('menuitem', { name: '編集' }))
      .toHaveAttribute('data-highlighted');
  });

  it('selects the highlighted item with Enter, closes, and returns focus to the trigger', async () => {
    renderMenu();
    const trigger = screen.getByRole('button', { name: '操作' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('menu');
    await userEvent.keyboard('{ArrowDown}');
    await expect
      .poll(() => screen.getByRole('menuitem', { name: '複製' }))
      .toHaveAttribute('data-highlighted');

    await userEvent.keyboard('{Enter}');
    await expect.poll(() => screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape and returns real focus to the trigger', async () => {
    renderMenu();
    const trigger = screen.getByRole('button', { name: '操作' });
    await userEvent.click(trigger);
    await screen.findByRole('menu');

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });
});
