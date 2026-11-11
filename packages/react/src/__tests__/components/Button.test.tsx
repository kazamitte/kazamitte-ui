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

  it('keeps a 44px minimum height on coarse pointers except as a link', () => {
    render(
      <>
        <Button size="sm">小</Button>
        <Button variant="link">リンク</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: '小' })).toHaveClass(
      'pointer-coarse:min-h-11',
    );
    expect(screen.getByRole('button', { name: 'リンク' })).not.toHaveClass(
      'pointer-coarse:min-h-11',
    );
  });
});

describe('Button loading', () => {
  it('does not call onClick while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        保存
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not submit the form while loading', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.SubmitEvent) =>
      event.preventDefault(),
    );
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          送信
        </Button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: '送信' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the form again once loading ends', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.SubmitEvent) =>
      event.preventDefault(),
    );
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">送信</Button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: '送信' }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('keeps focus by using aria-disabled instead of disabled', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Button>保存</Button>);
    await user.tab();
    const button = screen.getByRole('button', { name: '保存' });
    expect(button).toHaveFocus();

    rerender(<Button loading>保存</Button>);

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toBeDisabled();
  });

  it('shows a decorative spinner and keeps the label as the name', () => {
    const { container } = render(<Button loading>保存</Button>);
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('replaces the label with loadingText when given', () => {
    render(
      <Button loading loadingText="保存中">
        保存
      </Button>,
    );
    expect(screen.getByRole('button', { name: '保存中' })).toBeInTheDocument();
    expect(screen.queryByText('保存')).not.toBeInTheDocument();
  });

  it('shows the plain label when not loading', () => {
    render(<Button loadingText="保存中">保存</Button>);
    expect(screen.getByRole('button', { name: '保存' })).not.toHaveAttribute(
      'aria-disabled',
    );
  });
});
