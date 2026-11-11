import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { SkipLink } from '../../components/SkipLink';

describe('SkipLink', () => {
  it('stays out of sight until Tab focuses it, then shows at the top left above everything', async () => {
    render(
      <>
        <SkipLink href="#main" />
        <main id="main" />
      </>,
    );
    const link = screen.getByRole('link', { name: '本文へ移動' });
    expect(link.getBoundingClientRect().width).toBeLessThanOrEqual(1);

    await userEvent.tab();

    expect(link).toHaveFocus();
    const rect = link.getBoundingClientRect();
    expect(rect.width).toBeGreaterThan(1);
    expect(rect.top).toBeGreaterThanOrEqual(0);
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(getComputedStyle(link).position).toBe('fixed');
    // skip-nav layer token
    expect(getComputedStyle(link).zIndex).toBe('1600');
  });

  it('draws a focus ring while focused', async () => {
    render(<SkipLink href="#main" />);
    await userEvent.tab();
    const style = getComputedStyle(screen.getByRole('link'));
    expect(style.outlineStyle).not.toBe('none');
    expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2);
  });
});
