import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../../components/Skeleton';
import { Spinner } from '../../components/Spinner';

describe('Spinner', () => {
  it('is a status region announcing the loading label', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveTextContent('読み込み中');
  });

  it('takes a custom label', () => {
    render(<Spinner label="保存しています" size="sm" />);
    expect(screen.getByRole('status')).toHaveTextContent('保存しています');
  });

  it('renders as a hidden glyph with no status role when decorative', () => {
    render(<Spinner decorative data-testid="glyph" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    const glyph = screen.getByTestId('glyph');
    expect(glyph.tagName).toBe('SPAN');
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Skeleton', () => {
  it('shows a hidden placeholder while loading', () => {
    render(
      <Skeleton data-testid="skeleton" shape="circle">
        本文
      </Skeleton>,
    );
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByText('本文')).not.toBeInTheDocument();
  });

  it('renders the children once loading is over', () => {
    render(
      <Skeleton data-testid="skeleton" loading={false}>
        本文
      </Skeleton>,
    );
    expect(screen.getByText('本文')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });
});
