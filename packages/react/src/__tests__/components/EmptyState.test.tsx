import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from '../../components/EmptyState';

describe('EmptyState', () => {
  it('composes a hidden indicator with title, description and actions', () => {
    render(
      <EmptyState.Root>
        <EmptyState.Indicator data-testid="indicator">
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
    expect(screen.getByTestId('indicator')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
