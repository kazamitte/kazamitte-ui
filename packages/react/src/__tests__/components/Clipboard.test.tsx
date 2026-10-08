import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Clipboard } from '../../components/Clipboard';

const renderClipboard = (
  props: Partial<React.ComponentProps<typeof Clipboard.Root>> = {},
) =>
  render(
    <Clipboard.Root value="pnpm add @kazamitte/design-token" {...props}>
      <Clipboard.Label>インストール</Clipboard.Label>
      <Clipboard.Control>
        <Clipboard.Input />
        <Clipboard.Trigger>
          <Clipboard.Indicator copied="済">未</Clipboard.Indicator>
        </Clipboard.Trigger>
      </Clipboard.Control>
    </Clipboard.Root>,
  );

describe('Clipboard', () => {
  it('shows the value in a read-only input tied to the label', () => {
    renderClipboard();
    const input = screen.getByLabelText('インストール');
    expect(input).toHaveValue('pnpm add @kazamitte/design-token');
    expect(input).toHaveAttribute('readonly');
  });

  it('writes the value to the clipboard and flips the indicator', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    const onStatusChange = vi.fn();
    renderClipboard({ onStatusChange });

    const trigger = screen.getByRole('button', { name: 'コピー' });
    expect(screen.getByText('未')).toBeVisible();

    await user.click(trigger);
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        'pnpm add @kazamitte/design-token',
      ),
    );
    expect(onStatusChange).toHaveBeenCalledWith({ copied: true });
    expect(screen.getByText('済')).toBeVisible();
    expect(trigger).toHaveAccessibleName('コピーしました');
  });

  it('lets a translations override replace the Japanese trigger label', () => {
    renderClipboard({
      translations: { triggerLabel: (copied) => (copied ? 'Copied' : 'Copy') },
    });
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });
});
