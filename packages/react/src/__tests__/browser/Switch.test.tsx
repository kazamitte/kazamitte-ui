import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Switch } from '../../components/Switch';

describe('Switch', () => {
  it('toggles on with a real Space key press while focused', async () => {
    render(<Switch label="メール通知" />);
    const control = screen.getByRole('switch', { name: 'メール通知' });
    control.focus();
    expect(control).toHaveFocus();
    expect(control).not.toBeChecked();

    await userEvent.keyboard(' ');

    await waitFor(() => expect(control).toBeChecked());
  });

  it('toggles back off on a second Space key press', async () => {
    render(<Switch label="メール通知" defaultChecked />);
    const control = screen.getByRole('switch', { name: 'メール通知' });
    control.focus();
    expect(control).toBeChecked();

    await userEvent.keyboard(' ');

    await waitFor(() => expect(control).not.toBeChecked());
  });
});
