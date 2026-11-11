import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Skeleton } from '../../components/Skeleton';

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

describe('Skeleton delay', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const advance = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

  it('fades in after 200ms unless told otherwise', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('appear-late');
    expect(skeleton.style.getPropertyValue('--appear-delay')).toBe('200ms');
  });

  it('takes the wait from delay', () => {
    render(<Skeleton data-testid="skeleton" delay={500} />);
    expect(
      screen.getByTestId('skeleton').style.getPropertyValue('--appear-delay'),
    ).toBe('500ms');
  });

  it('shows immediately with delay={0}', () => {
    render(<Skeleton data-testid="skeleton" delay={0} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).not.toHaveClass('appear-late');
    expect(skeleton.style.getPropertyValue('--appear-delay')).toBe('');
  });

  it('keeps a style the caller passes', () => {
    render(<Skeleton data-testid="skeleton" style={{ width: 40 }} />);
    expect(screen.getByTestId('skeleton')).toHaveStyle({ width: '40px' });
  });

  it('renders no status without a label', async () => {
    render(<Skeleton />);
    await advance(1000);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('announces the label only once the delay has passed', async () => {
    render(<Skeleton label="読み込み中" delay={200} />);
    await advance(100);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await advance(200);
    await advance(10);
    expect(screen.getByRole('status')).toHaveTextContent('読み込み中');
  });

  it('announces the label right away with delay={0}', async () => {
    render(<Skeleton label="読み込み中" delay={0} />);
    await advance(10);
    expect(screen.getByRole('status')).toHaveTextContent('読み込み中');
  });

  it('drops the status with the placeholder when loading ends', async () => {
    const { rerender } = render(<Skeleton label="読み込み中" delay={0} />);
    await advance(10);
    rerender(
      <Skeleton label="読み込み中" delay={0} loading={false}>
        本文
      </Skeleton>,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
