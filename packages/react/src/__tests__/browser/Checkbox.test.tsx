import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Checkbox } from '../../components/Checkbox';

describe('Checkbox', () => {
  it('toggles on with a real Space key press while focused', async () => {
    render(<Checkbox label="規約に同意する" />);
    const checkbox = screen.getByRole('checkbox', { name: '規約に同意する' });
    checkbox.focus();
    expect(checkbox).toHaveFocus();
    expect(checkbox).not.toBeChecked();

    await userEvent.keyboard(' ');

    await waitFor(() => expect(checkbox).toBeChecked());
  });

  it('toggles back off on a second Space key press', async () => {
    render(<Checkbox label="規約に同意する" defaultChecked />);
    const checkbox = screen.getByRole('checkbox', { name: '規約に同意する' });
    checkbox.focus();
    expect(checkbox).toBeChecked();

    await userEvent.keyboard(' ');

    await waitFor(() => expect(checkbox).not.toBeChecked());
  });
});
