import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from '../../components/Chip';
import { EmptyState } from '../../components/EmptyState';
import { Stat } from '../../components/Stat';

describe('EmptyState', () => {
  it('composes a hidden indicator with title, description and actions', () => {
    render(
      <EmptyState.Root>
        <EmptyState.Indicator>
          <svg />
        </EmptyState.Indicator>
        <EmptyState.Content>
          <EmptyState.Title>まだ記事がありません</EmptyState.Title>
          <EmptyState.Description>
            最初の記事を書いてみましょう。
          </EmptyState.Description>
        </EmptyState.Content>
        <EmptyState.Actions>
          <button type="button">記事を書く</button>
        </EmptyState.Actions>
      </EmptyState.Root>,
    );
    expect(screen.getByText('まだ記事がありません')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '記事を書く' }),
    ).toBeInTheDocument();
    expect(document.querySelector('svg')?.parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});

describe('Stat', () => {
  it('pairs the label and value in a description list and says the trend in words', () => {
    render(
      <Stat.Root>
        <Stat.Label>月間訪問者</Stat.Label>
        <Stat.ValueText>12,340</Stat.ValueText>
        <Stat.HelpText>
          <Stat.Indicator trend="up">8%</Stat.Indicator> 先月比
        </Stat.HelpText>
      </Stat.Root>,
    );
    expect(screen.getByRole('term')).toHaveTextContent('月間訪問者');
    expect(screen.getAllByRole('definition')[0]).toHaveTextContent('12,340');
    const indicator = screen.getByText('8%');
    expect(indicator).toHaveTextContent('増加8%');
  });
});

describe('Chip', () => {
  it('is a plain token without onRemove', () => {
    render(<Chip>デザイン</Chip>);
    expect(screen.getByText('デザイン')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('adds a remove button named after the label', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>デザイン</Chip>);
    await user.click(screen.getByRole('button', { name: 'デザインを削除' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
