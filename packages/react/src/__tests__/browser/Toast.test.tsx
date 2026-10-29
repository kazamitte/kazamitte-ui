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

  it('offsets each toast so a newer one never covers an older one', async () => {
    const toaster = createToaster({ placement: 'bottom-end' });
    render(<Toaster toaster={toaster} />);
    act(() => {
      toaster.create({ title: '1件目', duration: Infinity });
      toaster.create({ title: '2件目', duration: Infinity });
    });
    await expect.poll(() => screen.queryAllByRole('status')).toHaveLength(2);

    const overlaps = (): boolean => {
      const [a, b] = screen
        .getAllByRole('status')
        .map((toast) => toast.getBoundingClientRect());
      if (a === undefined || b === undefined) return true;
      return a.top < b.bottom && b.top < a.bottom;
    };
    await expect.poll(overlaps).toBe(false);
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
