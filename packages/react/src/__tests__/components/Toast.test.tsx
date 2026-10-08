import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createToaster, Toaster } from '../../components/Toast';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

describe('Toaster', { timeout: 15000 }, () => {
  it('shows a created toast as a status with its title and description', async () => {
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
    expect(toast).toHaveAccessibleDescription('変更が反映されました。');
  });

  it('shows a loading toast without nesting a second status role', async () => {
    const toaster = createToaster({ placement: 'bottom-end' });
    render(<Toaster toaster={toaster} />);
    act(() => {
      toaster.create({ title: '送信しています', type: 'loading' });
    });
    const toast = await screen.findByRole('status');
    expect(toast).toHaveAccessibleName('送信しています');
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it.each(['error', 'warning'] as const)(
    'shows a %s toast as a single status',
    async (type) => {
      const toaster = createToaster({ placement: 'bottom-end' });
      render(<Toaster toaster={toaster} />);
      act(() => {
        toaster.create({ title: '失敗しました', type });
      });
      const toast = await screen.findByRole('status');
      expect(toast).toHaveAccessibleName('失敗しました');
      expect(screen.getAllByRole('status')).toHaveLength(1);
    },
  );

  it('shows a toast of a custom type without an indicator', async () => {
    const toaster = createToaster({ placement: 'bottom-end' });
    render(<Toaster toaster={toaster} />);
    act(() => {
      toaster.create({ title: 'メモを残しました', type: 'note' });
    });
    const toast = await screen.findByRole('status');
    expect(toast).toHaveAccessibleName('メモを残しました');
    const close = screen.getByRole('button', { name: '閉じる' });
    const icons = [...toast.querySelectorAll('svg')];
    expect(icons.filter((icon) => !close.contains(icon))).toEqual([]);
  });

  it('has no description when none is given', async () => {
    const toaster = createToaster({ placement: 'bottom-end' });
    render(<Toaster toaster={toaster} />);
    act(() => {
      toaster.create({ title: '保存しました' });
    });
    const toast = await screen.findByRole('status');
    expect(toast).toHaveAccessibleDescription('');
  });

  it('runs the action handler when its button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const toaster = createToaster({ placement: 'bottom-end' });
    render(<Toaster toaster={toaster} />);
    act(() => {
      toaster.create({
        title: '削除しました',
        duration: Infinity,
        action: { label: '元に戻す', onClick },
      });
    });
    await user.click(await screen.findByRole('button', { name: '元に戻す' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('dismisses a toast from its close button', async () => {
    const user = userEvent.setup();
    const toaster = createToaster({ placement: 'bottom-end', removeDelay: 0 });
    render(<Toaster toaster={toaster} />);
    act(() => {
      toaster.create({ title: '削除しました', duration: Infinity });
    });
    await screen.findByRole('status');
    await user.click(screen.getByRole('button', { name: '閉じる' }));
    await waitFor(
      () => expect(screen.queryByRole('status')).not.toBeInTheDocument(),
      { timeout: 10000 },
    );
  });
});
