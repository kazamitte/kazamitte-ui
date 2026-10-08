import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
