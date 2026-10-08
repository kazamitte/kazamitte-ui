import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../../components/Dialog';

const renderDialog = (props: React.ComponentProps<typeof Dialog.Root> = {}) =>
  render(
    <Dialog.Root {...props}>
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
              <Dialog.CloseTrigger>閉じる</Dialog.CloseTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>,
  );

describe('Dialog', () => {
  it('opens a modal dialog named by its title and described by its description', async () => {
    const user = userEvent.setup();
    renderDialog();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '削除' }));
    const dialog = await screen.findByRole('dialog', {
      name: '本当に削除しますか？',
    });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('この操作は取り消せません。');
  });

  it('closes from the close trigger, reporting the change', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderDialog({ defaultOpen: true, onOpenChange });
    await user.click(await screen.findByRole('button', { name: '閉じる' }));
    expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('leaves a custom close element unstyled with asChild', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Title>確認</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <button type="button" className="mine">
                  やめる
                </button>
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    const button = await screen.findByRole('button', { name: 'やめる' });
    expect(button.className).toBe('mine');
  });
});
