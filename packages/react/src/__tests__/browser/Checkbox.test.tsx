import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Checkbox } from '../../components/Checkbox';

describe('Checkbox', () => {
  it('is reachable with Tab and toggles on with Space', async () => {
    render(<Checkbox label="規約に同意する" />);
    const checkbox = screen.getByRole('checkbox', { name: '規約に同意する' });
    await userEvent.tab();
    expect(checkbox).toHaveFocus();
    expect(checkbox).not.toBeChecked();

    await userEvent.keyboard(' ');

    await waitFor(() => expect(checkbox).toBeChecked());
  });

  it('unchecks a default-checked checkbox with Space after Tab', async () => {
    render(<Checkbox label="規約に同意する" defaultChecked />);
    const checkbox = screen.getByRole('checkbox', { name: '規約に同意する' });
    await userEvent.tab();
    expect(checkbox).toHaveFocus();
    expect(checkbox).toBeChecked();

    await userEvent.keyboard(' ');

    await waitFor(() => expect(checkbox).not.toBeChecked());
  });

  it('exposes indeterminate as mixed when checked changes to indeterminate', async () => {
    const { rerender } = render(
      <Checkbox label="すべて選択" checked={false} />,
    );
    rerender(<Checkbox label="すべて選択" checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox', { name: 'すべて選択' });
    await waitFor(() => expect(checkbox).toBePartiallyChecked());
  });
});
