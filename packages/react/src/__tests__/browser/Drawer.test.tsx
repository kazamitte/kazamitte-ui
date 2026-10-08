import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Drawer } from '../../components/Drawer';

const renderDrawer = () =>
  render(
    <>
      <button type="button">前のボタン</button>
      <Drawer.Root>
        <Drawer.Trigger>編集</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content size="sm">
              <Drawer.Header>
                <Drawer.Title>プロフィールを編集</Drawer.Title>
                <Drawer.Description>
                  変更は保存まで反映されません。
                </Drawer.Description>
              </Drawer.Header>
              <Drawer.Footer>
                <button type="button">キャンセル</button>
                <Drawer.CloseTrigger>閉じる</Drawer.CloseTrigger>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Portal>
      </Drawer.Root>
      <button type="button">後のボタン</button>
    </>,
  );

describe('Drawer', () => {
  it('moves real focus inside the drawer when it opens', async () => {
    renderDrawer();
    await userEvent.click(screen.getByRole('button', { name: '編集' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('keeps Tab and Shift+Tab cycling inside the drawer', async () => {
    renderDrawer();
    await userEvent.click(screen.getByRole('button', { name: '編集' }));
    const dialog = await screen.findByRole('dialog');

    for (let i = 0; i < 6; i += 1) {
      await userEvent.keyboard('{Tab}');
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    for (let i = 0; i < 6; i += 1) {
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it('hides the page behind it from Tab and the accessibility tree', async () => {
    renderDrawer();
    const before = screen.getByRole('button', { name: '前のボタン' });
    const after = screen.getByRole('button', { name: '後のボタン' });

    await userEvent.click(screen.getByRole('button', { name: '編集' }));
    await screen.findByRole('dialog');

    expect(
      screen.queryByRole('button', { name: '前のボタン' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '後のボタン' }),
    ).not.toBeInTheDocument();

    for (let i = 0; i < 6; i += 1) {
      await userEvent.keyboard('{Tab}');
    }
    expect(before).not.toHaveFocus();
    expect(after).not.toHaveFocus();
  });

  it('returns focus to the trigger after closing with Escape', async () => {
    renderDrawer();
    const trigger = screen.getByRole('button', { name: '編集' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog');

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('returns focus to the trigger after closing from the close button', async () => {
    renderDrawer();
    const trigger = screen.getByRole('button', { name: '編集' });
    await userEvent.click(trigger);
    await userEvent.click(
      await screen.findByRole('button', { name: '閉じる' }),
    );

    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });
});
