import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link } from '../../components/Link';

describe('Link', () => {
  it('renders an underlined anchor', () => {
    render(<Link href="https://example.com">例</Link>);
    const link = screen.getByRole('link', { name: '例' });
    expect(link).toHaveAttribute('href', 'https://example.com');
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

  it('rejects external together with asChild at the type level', () => {
    const invalid = () => (
      // @ts-expect-error external and asChild cannot be combined
      <Link asChild external>
        <a href="https://example.com">例</a>
      </Link>
    );
    expect(invalid).toBeTypeOf('function');
  });
});
