import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createToaster, Toaster } from '../../components/Toast';

describe('Toaster', { timeout: 15000 }, () => {
  it('announces a created toast through exactly one status live region', async () => {
    const toaster = createToaster({ placement: 'bottom-end' });
    render(<Toaster toaster={toaster} />);
    act(() => {
      toaster.create({
        title: '保存しました',
        description: '変更が反映されました。',
        type: 'success',
      });
    });

    const toast = await screen.findByRole('status');
    expect(toast).toHaveAccessibleName('保存しました');
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it('reaches and activates the close button with the keyboard', async () => {
    const toaster = createToaster({
      placement: 'bottom-end',
      removeDelay: 0,
    });
    render(<Toaster toaster={toaster} />);
    act(() => {
      toaster.create({ title: '削除しました', duration: Infinity });
    });
    await screen.findByRole('status');

    const closeButton = screen.getByRole('button', { name: '閉じる' });
    closeButton.focus();
    expect(closeButton).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect.poll(() => screen.queryByRole('status')).toBeNull();
  });
});
