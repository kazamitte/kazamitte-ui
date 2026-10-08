import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from '../../components/Alert';

describe('Alert', () => {
  it('composes indicator, title and description with the alert role', () => {
    render(
      <Alert.Root status="warning" live="assertive">
        <Alert.Indicator status="warning" />
        <Alert.Content>
          <Alert.Title>未保存の変更</Alert.Title>
          <Alert.Description>ページを離れると失われます。</Alert.Description>
        </Alert.Content>
      </Alert.Root>,
    );
    const root = screen.getByRole('alert');
    expect(root.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('未保存の変更')).toBeInTheDocument();
    expect(
      screen.getByText('ページを離れると失われます。'),
    ).toBeInTheDocument();
  });

  it('lets a custom icon replace the default indicator and hides it from assistive technology', () => {
    render(
      <Alert.Root>
        <Alert.Indicator data-testid="indicator">
          <span>★</span>
        </Alert.Indicator>
      </Alert.Root>,
    );
    const indicator = screen.getByTestId('indicator');
    expect(indicator).toHaveTextContent('★');
    expect(indicator.querySelector('svg')).toBeNull();
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses a different default icon for each status', () => {
    render(
      <>
        <Alert.Indicator status="neutral" data-testid="neutral" />
        <Alert.Indicator status="error" data-testid="error" />
      </>,
    );
    const neutral = screen.getByTestId('neutral').innerHTML;
    const error = screen.getByTestId('error').innerHTML;
    expect(neutral).not.toBe('');
    expect(error).not.toBe(neutral);
  });

  it('announces politely through an atomic aria-live region without taking the alert role', () => {
    render(
      <Alert.Root status="success" live="polite" data-testid="alert">
        <Alert.Title>保存しました</Alert.Title>
      </Alert.Root>,
    );
    const root = screen.getByTestId('alert');
    expect(root).toHaveAttribute('aria-live', 'polite');
    expect(root).toHaveAttribute('aria-atomic', 'true');
    expect(root).not.toHaveAttribute('role');
  });

  it('takes the alert role without aria-live when assertive', () => {
    render(<Alert.Root live="assertive">エラーです</Alert.Root>);
    const root = screen.getByRole('alert');
    expect(root).not.toHaveAttribute('aria-live');
  });

  it('is neither an alert nor a live region without live', () => {
    render(<Alert.Root data-testid="alert">お知らせ</Alert.Root>);
    const root = screen.getByTestId('alert');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-live');
  });
});
