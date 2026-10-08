import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Tour, useTour, type TourStep } from '../../components/Tour';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const STEPS: TourStep[] = [
  {
    id: 'welcome',
    type: 'dialog',
    title: 'ようこそ',
    description: '主な機能を案内します。',
    actions: [{ label: '始める', action: 'next' }],
  },
  {
    id: 'save',
    type: 'tooltip',
    title: '保存',
    description: 'ここで保存します。',
    target: () => document.querySelector<HTMLElement>('#save'),
    actions: [
      { label: '戻る', action: 'prev' },
      { label: '完了', action: 'dismiss' },
    ],
  },
];

const Sample = () => {
  const tour = useTour({ steps: STEPS });
  return (
    <>
      <button type="button" onClick={() => tour.start()}>
        ツアーを始める
      </button>
      <button type="button" id="save">
        保存
      </button>
      <Tour tour={tour} />
    </>
  );
};

describe('Tour', { timeout: 15000 }, () => {
  it('walks through the steps with the actions each step names', async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole('button', { name: 'ツアーを始める' }));
    const dialog = await screen.findByRole('alertdialog');
    expect(dialog).toHaveAccessibleName('ようこそ');
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '始める' }));
    await screen.findByText('ここで保存します。');
    expect(screen.getByText('2 / 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '完了' }));
    await waitFor(() =>
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
    );
  });

  it('closes from the close button named in Japanese', async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole('button', { name: 'ツアーを始める' }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: '閉じる' }));
    await waitFor(() =>
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
    );
  });

  it('skips the tour from a skip action and reports the status', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();
    const Skippable = () => {
      const tour = useTour({
        steps: STEPS.map((step, index) =>
          index === 0
            ? {
                ...step,
                actions: [
                  { label: 'あとで', action: 'skip' as const },
                  { label: '始める', action: 'next' as const },
                ],
              }
            : step,
        ),
        onStatusChange,
      });
      return (
        <>
          <button type="button" onClick={() => tour.start()}>
            ツアーを始める
          </button>
          <Tour tour={tour} />
        </>
      );
    };
    render(<Skippable />);
    await user.click(screen.getByRole('button', { name: 'ツアーを始める' }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: 'あとで' }));
    await waitFor(() =>
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
    );
    expect(onStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'skipped' }),
    );
  });

  it('overrides one translation and keeps the other Japanese defaults', async () => {
    const user = userEvent.setup();
    const Custom = () => {
      const tour = useTour({ steps: STEPS, translations: { close: '×' } });
      return (
        <>
          <button type="button" onClick={() => tour.start()}>
            ツアーを始める
          </button>
          <Tour tour={tour} />
        </>
      );
    };
    render(<Custom />);
    await user.click(screen.getByRole('button', { name: 'ツアーを始める' }));
    await screen.findByRole('alertdialog');
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });
});
