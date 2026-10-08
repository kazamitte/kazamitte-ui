import { render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { Toc } from '../../components/Toc';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

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

  it('names the navigation after the custom title', () => {
    render(<Toc items={ITEMS} title="Contents" />);
    const nav = screen.getByRole('navigation', { name: 'Contents' });
    expect(within(nav).queryByText('目次')).not.toBeInTheDocument();
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

  it('lets a controlled activeIds take precedence over the default', () => {
    render(
      <Toc items={ITEMS} defaultActiveIds={['variant']} activeIds={['size']} />,
    );
    expect(screen.getByRole('link', { name: 'size' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(
      screen.getByRole('link', { name: 'バリアント' }),
    ).not.toHaveAttribute('aria-current');
  });
});
