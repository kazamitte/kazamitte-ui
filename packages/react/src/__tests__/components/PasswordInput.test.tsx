import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PasswordInput } from '../../components/PasswordInput';

describe('PasswordInput', () => {
  it('renders a masked input named by the label with a Japanese toggle', () => {
    render(<PasswordInput label="パスワード" />);
    const input = screen.getByLabelText('パスワード');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
    expect(
      screen.getByRole('button', { name: 'パスワードを表示' }),
    ).toBeInTheDocument();
  });

  it('reveals the text on toggle, renames the button and reports the change', async () => {
    const user = userEvent.setup();
    const onVisibilityChange = vi.fn();
    render(
      <PasswordInput
        label="パスワード"
        onVisibilityChange={onVisibilityChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'パスワードを表示' }));
    await waitFor(() =>
      expect(screen.getByLabelText('パスワード')).toHaveAttribute(
        'type',
        'text',
      ),
    );
    expect(onVisibilityChange).toHaveBeenCalledWith({ visible: true });
    expect(
      screen.getByRole('button', { name: 'パスワードを隠す' }),
    ).toBeInTheDocument();
  });

  it('passes autoComplete through for a new password', () => {
    render(
      <PasswordInput label="新しいパスワード" autoComplete="new-password" />,
    );
    expect(screen.getByLabelText('新しいパスワード')).toHaveAttribute(
      'autocomplete',
      'new-password',
    );
  });

  it('marks the input invalid and disables the toggle when disabled', () => {
    render(<PasswordInput label="パスワード" invalid disabled />);
    const input = screen.getByLabelText('パスワード');
    expect(input).toBeInvalid();
    expect(input).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'パスワードを表示' }),
    ).toBeDisabled();
  });
});
