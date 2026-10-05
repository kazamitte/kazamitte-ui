import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Dialog } from '../../components/Dialog';

const renderDialog = () =>
  render(
    <>
      <button type="button">前のボタン</button>
      <Dialog.Root>
        <Dialog.Trigger>削除</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content size="sm">
              <Dialog.Header>
                <Dialog.Title>本当に削除しますか？</Dialog.Title>
                <Dialog.Description>
                  この操作は取り消せません。
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer>
                <button type="button">キャンセル</button>
                <Dialog.CloseTrigger>閉じる</Dialog.CloseTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Portal>
      </Dialog.Root>
      <button type="button">後のボタン</button>
    </>,
  );

describe('Dialog', () => {
  it('moves real focus inside the dialog when it opens', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: '削除' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('keeps Tab and Shift+Tab cycling inside the dialog', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: '削除' }));
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
    renderDialog();
    const before = screen.getByRole('button', { name: '前のボタン' });
    const after = screen.getByRole('button', { name: '後のボタン' });

    await userEvent.click(screen.getByRole('button', { name: '削除' }));
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
    renderDialog();
    const trigger = screen.getByRole('button', { name: '削除' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog');

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('returns focus to the trigger after closing from the close button', async () => {
    renderDialog();
    const trigger = screen.getByRole('button', { name: '削除' });
    await userEvent.click(trigger);
    await userEvent.click(
      await screen.findByRole('button', { name: '閉じる' }),
    );

    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });
});
