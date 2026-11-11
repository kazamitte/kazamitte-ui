import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkipLink } from '../../components/SkipLink';

describe('SkipLink', () => {
  it('is a link to the given target named 本文へ移動 by default', () => {
    render(<SkipLink href="#main" />);
    expect(screen.getByRole('link', { name: '本文へ移動' })).toHaveAttribute(
      'href',
      '#main',
    );
  });

  it('takes its own text as children', () => {
    render(<SkipLink href="#content">Skip to content</SkipLink>);
    expect(
      screen.getByRole('link', { name: 'Skip to content' }),
    ).toBeInTheDocument();
  });

  it('forwards the ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<SkipLink ref={ref} href="#main" />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
