import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CodeBlock } from '../../components/CodeBlock';

describe('CodeBlock', () => {
  it('shows the language label and the plain code when no markup is given', () => {
    render(<CodeBlock code="const a = 1;" language="ts" />);
    expect(screen.getByText('ts')).toBeInTheDocument();
    expect(screen.getByText('const a = 1;').closest('pre')).not.toBeNull();
  });

  it('is keyboard-focusable by default so the scroll region is reachable without a mouse', () => {
    render(<CodeBlock code="const a = 1;" language="ts" />);
    expect(screen.getByText('const a = 1;').closest('pre')).toHaveAttribute(
      'tabIndex',
      '0',
    );
  });

  it('lets a passed tabIndex override the default', () => {
    render(<CodeBlock code="const a = 1;" language="ts" tabIndex={-1} />);
    expect(screen.getByText('const a = 1;').closest('pre')).toHaveAttribute(
      'tabIndex',
      '-1',
    );
  });

  it('renders the highlighted markup in place of the plain code', () => {
    render(
      <CodeBlock code="const a = 1;" language="ts">
        <code>
          <span>const</span> a = 1;
        </code>
      </CodeBlock>,
    );
    expect(screen.getByText('const')).toBeInTheDocument();
    expect(screen.queryByText('const a = 1;')).not.toBeInTheDocument();
  });

  it('copies the plain code, not the markup', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    render(
      <CodeBlock code="const a = 1;">
        <code>
          <span>const</span> a = 1;
        </code>
      </CodeBlock>,
    );
    await user.click(screen.getByRole('button', { name: 'コピー' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('const a = 1;'));
  });
});
