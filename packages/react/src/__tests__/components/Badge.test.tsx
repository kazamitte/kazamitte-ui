import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../../components/Badge';

describe('Badge', () => {
  it('reads as inline text, without a role of its own', () => {
    render(
      <p>
        記事は<Badge tone="success">公開</Badge>です
      </p>,
    );
    const badge = screen.getByText('公開');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).not.toHaveAttribute('role');
    expect(screen.getByRole('paragraph')).toHaveTextContent('記事は公開です');
  });
});
