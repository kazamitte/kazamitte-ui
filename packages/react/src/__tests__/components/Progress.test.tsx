import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from '../../components/Progress';

describe('Progress', () => {
  it('is a progressbar named by its label with the current value', () => {
    render(<Progress label="アップロード" value={40} showValueText />);
    const bar = screen.getByRole('progressbar', { name: 'アップロード' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('is named by aria-label when there is no visible label', () => {
    render(<Progress aria-label="アップロード" value={40} />);
    expect(
      screen.getByRole('progressbar', { name: 'アップロード' }),
    ).toBeVisible();
    expect(screen.queryByText('アップロード')).toBeNull();
  });

  it('requires a name at the type level (typecheck guard, enforced by tsc)', () => {
    // @ts-expect-error a progressbar needs label or aria-label
    const unnamed = <Progress value={40} />;
    expect(unnamed).toBeDefined();
  });

  it('sizes the range to the percentage of the custom range', () => {
    render(<Progress label="進み具合" value={25} max={50} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '25');
    expect(bar).toHaveAttribute('aria-valuemax', '50');
    const range = bar.querySelector('[data-part="range"]');
    expect(range).toHaveStyle({ width: '50%' });
  });

  it('becomes indeterminate without a value', () => {
    render(<Progress label="読み込み" value={null} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });
});
