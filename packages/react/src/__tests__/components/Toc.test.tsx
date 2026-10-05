import { render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Toc } from '../../components/Toc';

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
});

const ITEMS = [
  { value: 'overview', depth: 2, label: '概要' },
  { value: 'variant', depth: 2, label: 'バリアント' },
  { value: 'size', depth: 3, label: 'size' },
];

describe('Toc', () => {
  it('lists the headings as links to their ids under the title', () => {
    render(<Toc items={ITEMS} />);
    const nav = screen.getByRole('navigation');
    expect(within(nav).getByText('目次')).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'size' })).toHaveAttribute(
      'href',
      '#size',
    );
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
  });

  it('exposes the depth for indentation', () => {
    render(<Toc items={ITEMS} />);
    expect(
      screen.getByRole('link', { name: 'size' }).closest('li'),
    ).toHaveAttribute('data-depth', '3');
  });

  it('marks the active heading as the current location', () => {
    render(<Toc items={ITEMS} defaultActiveIds={['variant']} />);
    expect(screen.getByRole('link', { name: 'バリアント' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(screen.getByRole('link', { name: '概要' })).not.toHaveAttribute(
      'aria-current',
    );
  });
});
