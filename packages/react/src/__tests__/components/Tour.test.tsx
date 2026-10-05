import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
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

  // Ark's TourBackdrop never gets presence-driven `hidden`, so it keeps
  // pointer-events: auto after close; `ark-closed:` must stay.
  it('keeps the backdrop non-interactive once closed, since Ark leaves it mounted', async () => {
    const user = userEvent.setup();
    const { container } = render(<Sample />);
    await user.click(screen.getByRole('button', { name: 'ツアーを始める' }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: '閉じる' }));
    await waitFor(() =>
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
    );

    const backdrop = container.ownerDocument.querySelector(
      '[data-scope="tour"][data-part="backdrop"]',
    );
    expect(backdrop).toHaveAttribute('data-state', 'closed');
    expect(backdrop?.className).toContain('ark-closed:pointer-events-none');
  });

  // Ark never defines --tour-z-index, so the positioner's calc() z-index is
  // invalid (z-index: auto) and falls below the backdrop, unclickable.
  it('gives the tooltip-step positioner a real --tour-z-index, since Ark never defines one', async () => {
    const user = userEvent.setup();
    const { container } = render(<Sample />);
    await user.click(screen.getByRole('button', { name: 'ツアーを始める' }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: '始める' }));
    await screen.findByText('ここで保存します。');

    const positioner = container.ownerDocument.querySelector(
      '[data-scope="tour"][data-part="positioner"]',
    );
    expect(positioner?.className).toContain(
      '[--tour-z-index:var(--z-index-modal)]',
    );
  });
});
