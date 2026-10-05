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

  it('lets a custom icon replace the default indicator', () => {
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
  });

  it('hides a custom indicator from the accessibility tree by default', () => {
    render(
      <Alert.Root>
        <Alert.Indicator data-testid="indicator">
          <span>★</span>
        </Alert.Indicator>
      </Alert.Root>,
    );
    const indicator = screen.getByTestId('indicator');
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    expect(indicator).toHaveTextContent('★');
  });

  it('announces politely through aria-live without taking the alert role', () => {
    render(
      <Alert.Root status="success" live="polite" data-testid="alert">
        <Alert.Title>保存しました</Alert.Title>
      </Alert.Root>,
    );
    const root = screen.getByTestId('alert');
    expect(root).toHaveAttribute('aria-live', 'polite');
    expect(root).not.toHaveAttribute('role');
  });
});
