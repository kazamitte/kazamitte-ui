import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link } from '../../components/Link';

describe('Link', () => {
  it('renders an anchor with the given href and no new-tab attributes', () => {
    render(<Link href="https://example.com">例</Link>);
    const link = screen.getByRole('link', { name: '例' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('renders the child element as the link with asChild, without new-tab markup', () => {
    render(
      <Link asChild>
        <a href="/docs">ドキュメント</a>
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'ドキュメント' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('opens externally in a new tab and tells assistive technology', () => {
    render(
      <Link href="https://example.com" external>
        例
      </Link>,
    );
    const link = screen.getByRole('link', {
      name: '例（新しいタブで開きます）',
    });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('typecheck guard: external and asChild cannot be combined (enforced by tsc)', () => {
    const invalid = () => (
      // @ts-expect-error external and asChild cannot be combined
      <Link asChild external>
        <a href="https://example.com">例</a>
      </Link>
    );
    expect(invalid).toBeTypeOf('function');
  });
});
