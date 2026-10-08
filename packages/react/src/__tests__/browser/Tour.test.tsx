import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Tour, useTour, type TourStep } from '../../components/Tour';

const STEPS: TourStep[] = [
  {
    id: 'welcome',
    type: 'dialog',
    title: 'ようこそ',
    description: '主な機能を案内します。',
    actions: [{ label: '次へ', action: 'next' }],
  },
  {
    id: 'save',
    type: 'dialog',
    title: '保存',
    description: 'ここで保存します。',
    actions: [
      { label: '戻る', action: 'prev' },
      { label: '完了', action: 'dismiss' },
    ],
  },
];

const TOOLTIP_STEPS: TourStep[] = [
  {
    id: 'save',
    type: 'tooltip',
    title: '保存',
    description: 'ここで保存します。',
    target: () => document.querySelector<HTMLElement>('#save'),
    actions: [{ label: '完了', action: 'dismiss' }],
  },
];

const TooltipSample = () => {
  const tour = useTour({ steps: TOOLTIP_STEPS });
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

const part = (name: string): HTMLElement => {
  const el = document.querySelector<HTMLElement>(
    `[data-scope="tour"][data-part="${name}"]`,
  );
  if (el === null) throw new Error(`tour ${name} not rendered`);
  return el;
};

const Sample = () => {
  const tour = useTour({ steps: STEPS });
  return (
    <>
      <button type="button" onClick={() => tour.start()}>
        ツアーを始める
      </button>
      <Tour tour={tour} />
    </>
  );
};

describe('Tour', { timeout: 15000 }, () => {
  it('moves real focus into the step content when it opens', async () => {
    render(<Sample />);
    await userEvent.click(
      screen.getByRole('button', { name: 'ツアーを始める' }),
    );

    const dialog = await screen.findByRole('alertdialog');
    await expect.poll(() => dialog.contains(document.activeElement)).toBe(true);
  });

  it('moves to the next and previous step from the keyboard', async () => {
    render(<Sample />);
    await userEvent.click(
      screen.getByRole('button', { name: 'ツアーを始める' }),
    );
    expect(
      await screen.findByRole('alertdialog', { name: 'ようこそ' }),
    ).toBeInTheDocument();

    const next = screen.getByRole('button', { name: '次へ' });
    next.focus();
    await userEvent.keyboard('{Enter}');
    expect(
      await screen.findByRole('alertdialog', { name: '保存' }),
    ).toBeInTheDocument();

    const prev = screen.getByRole('button', { name: '戻る' });
    prev.focus();
    await userEvent.keyboard('{Enter}');
    expect(
      await screen.findByRole('alertdialog', { name: 'ようこそ' }),
    ).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    render(<Sample />);
    await userEvent.click(
      screen.getByRole('button', { name: 'ツアーを始める' }),
    );
    await screen.findByRole('alertdialog');

    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('alertdialog')).toBeNull();
  });

  it('stops the backdrop from catching pointer events once the tour is closed', async () => {
    render(<Sample />);
    await userEvent.click(
      screen.getByRole('button', { name: 'ツアーを始める' }),
    );
    await screen.findByRole('alertdialog');
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('alertdialog')).toBeNull();

    expect(getComputedStyle(part('backdrop')).pointerEvents).toBe('none');
  });

  it('stacks the tooltip-step positioner above the backdrop so its actions stay clickable', async () => {
    render(<TooltipSample />);
    await userEvent.click(
      screen.getByRole('button', { name: 'ツアーを始める' }),
    );
    await screen.findByRole('alertdialog');

    const positionerZ = Number(getComputedStyle(part('positioner')).zIndex);
    const backdropZ = Number(getComputedStyle(part('backdrop')).zIndex);
    expect(positionerZ).toBeGreaterThan(backdropZ);
  });
});
