import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from '../../components/Separator';

describe('Separator', () => {
  it('renders a horizontal rule by default', () => {
    render(<Separator />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('HR');
    expect(separator).not.toHaveAttribute('aria-orientation');
  });

  it('announces the vertical orientation', () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });
});
