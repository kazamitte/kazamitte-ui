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

  it('sizes the range to the percentage of the custom range', () => {
    render(<Progress label="進み具合" value={25} max={50} />);
    const bar = screen.getByRole('progressbar');
    const range = bar.querySelector('[data-part="range"]');
    expect(range).toHaveStyle({ width: '50%' });
  });

  it('becomes indeterminate without a value', () => {
    render(<Progress label="読み込み" value={null} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar.querySelector('[data-part="range"]')).toHaveAttribute(
      'data-state',
      'indeterminate',
    );
  });
});
