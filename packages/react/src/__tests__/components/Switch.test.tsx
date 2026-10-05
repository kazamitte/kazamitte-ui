import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '../../components/Switch';

describe('Switch', () => {
  it('renders a switch named by the label', () => {
    render(<Switch label="メール通知" />);
    expect(
      screen.getByRole('switch', { name: 'メール通知' }),
    ).not.toBeChecked();
  });

  it('toggles on click and forwards onCheckedChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="メール通知" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch', { name: 'メール通知' }));
    expect(onCheckedChange).toHaveBeenCalledWith({ checked: true });
    expect(screen.getByRole('switch', { name: 'メール通知' })).toBeChecked();
  });

  it('forwards the disabled state', () => {
    render(<Switch label="無効" disabled defaultChecked />);
    const control = screen.getByRole('switch', { name: '無効' });
    expect(control).toBeDisabled();
    expect(control).toBeChecked();
  });
});
