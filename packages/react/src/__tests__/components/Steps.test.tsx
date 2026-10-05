import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Steps } from '../../components/Steps';

const STEPS = [
  { value: 'account', title: 'アカウント', description: 'メールと氏名' },
  { value: 'address', title: '住所' },
  { value: 'confirm', title: '確認' },
];

const renderSteps = (
  props: Omit<React.ComponentProps<typeof Steps.Root>, 'steps'> = {},
) =>
  render(
    <Steps.Root steps={STEPS} {...props}>
      <Steps.Progress />
      {STEPS.map((step, index) => (
        <Steps.Content key={step.value} index={index}>
          {step.title}の入力
        </Steps.Content>
      ))}
      <Steps.CompletedContent>すべて完了しました</Steps.CompletedContent>
      <Steps.PrevTrigger>戻る</Steps.PrevTrigger>
      <Steps.NextTrigger>次へ</Steps.NextTrigger>
    </Steps.Root>,
  );

describe('Steps', () => {
  it('lists the steps as tabs, marking the current one and showing only its panel', () => {
    renderSteps();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveTextContent('1アカウントメールと氏名');
    expect(tabs[0]).toHaveAttribute('aria-current', 'step');
    expect(tabs[1]).not.toHaveAttribute('aria-current');
    expect(tabs[0].closest('[data-part="item"]')).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByText('アカウントの入力')).toBeVisible();
    expect(screen.getByText('住所の入力')).not.toBeVisible();
  });

  it('moves with the next / prev triggers and reports the step', async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    renderSteps({ onStepChange });
    const prev = screen.getByRole('button', { name: '戻る' });
    expect(prev).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '次へ' }));
    expect(onStepChange).toHaveBeenLastCalledWith({ step: 1 });
    expect(screen.getByText('住所の入力')).toBeVisible();
    expect(prev).toBeEnabled();

    await user.click(prev);
    expect(onStepChange).toHaveBeenLastCalledWith({ step: 0 });
  });

  it('swaps the number for a check mark once a step is complete', async () => {
    const user = userEvent.setup();
    renderSteps({ defaultStep: 1 });
    const indicators = document.querySelectorAll('[data-part="indicator"]');
    expect(indicators[0]).toHaveAttribute('data-complete');
    expect(indicators[0]?.querySelector('svg')).toBeInTheDocument();
    expect(indicators[0]).not.toHaveTextContent('1');
    expect(indicators[1]).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: '戻る' }));
    expect(indicators[0]).toHaveTextContent('1');
  });

  it('jumps to a step from its tab unless linear', async () => {
    const user = userEvent.setup();
    const { unmount } = renderSteps();
    await user.click(screen.getByRole('tab', { name: /確認/ }));
    expect(screen.getByText('確認の入力')).toBeVisible();
    unmount();

    renderSteps({ linear: true });
    await user.click(screen.getByRole('tab', { name: /確認/ }));
    expect(screen.getByText('アカウントの入力')).toBeVisible();
    expect(screen.getByRole('tab', { name: /確認/ })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('shows the completed content and a full progress bar after the last step', async () => {
    const user = userEvent.setup();
    renderSteps({ defaultStep: 2 });
    const bar = screen.getByRole('progressbar', { name: '進み具合' });
    expect(Number(bar.getAttribute('aria-valuenow'))).toBeCloseTo(66.67, 1);
    expect(bar).toHaveAttribute('aria-valuetext', '67%完了');

    await user.click(screen.getByRole('button', { name: '次へ' }));
    expect(screen.getByText('すべて完了しました')).toBeVisible();
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(bar).toHaveAttribute('aria-valuetext', '100%完了');
    expect(screen.getByRole('button', { name: '次へ' })).toBeDisabled();
  });

  it('follows a controlled step', () => {
    renderSteps({ step: 1 });
    expect(screen.getByRole('tab', { name: /住所/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
