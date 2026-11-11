import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../../components/Skeleton';

const opacityOf = (id: string) =>
  Number(getComputedStyle(screen.getByTestId(id)).opacity);

describe('Skeleton', () => {
  it('stays transparent for the delay, then fades in', async () => {
    render(<Skeleton data-testid="late" delay={300} className="h-4 w-20" />);
    expect(opacityOf('late')).toBe(0);

    await expect.poll(() => opacityOf('late'), { timeout: 2000 }).toBe(1);
  });

  it('is fully visible at once with delay={0}', () => {
    render(<Skeleton data-testid="now" delay={0} className="h-4 w-20" />);
    expect(opacityOf('now')).toBe(1);
  });
});
