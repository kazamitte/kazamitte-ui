import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';

describe('Button', () => {
  it('renders a native button defaulting to type="button"', () => {
    render(<Button>送信</Button>);
    expect(screen.getByRole('button', { name: '送信' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('forwards onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>押す</Button>);
    await user.click(screen.getByRole('button', { name: '押す' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards the disabled state', () => {
    render(<Button disabled>送信</Button>);
    expect(screen.getByRole('button', { name: '送信' })).toBeDisabled();
  });

  it('renders the child element in place of a button when asChild is set', () => {
    render(
      <Button asChild variant="outline">
        <a href="/docs">ドキュメント</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'ドキュメント' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).not.toHaveAttribute('type');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not nest a live status when a loading state uses a decorative spinner', () => {
    render(
      <Button disabled>
        <Spinner size="sm" decorative />
        保存中
      </Button>,
    );
    expect(screen.getByRole('button', { name: '保存中' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
