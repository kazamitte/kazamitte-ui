import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from '../../components/Breadcrumbs';

const renderBreadcrumbs = (label?: string) =>
  render(
    <Breadcrumbs.Root aria-label={label}>
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="https://example.com/">home</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="https://example.com/components">
            Components
          </Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Separator>/</Breadcrumbs.Separator>
          <Breadcrumbs.CurrentLink>Button</Breadcrumbs.CurrentLink>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>,
  );

describe('Breadcrumbs', () => {
  it('is a labelled navigation landmark holding an ordered list', () => {
    renderBreadcrumbs();
    const nav = screen.getByRole('navigation', { name: '現在位置' });
    expect(within(nav).getByRole('list').tagName).toBe('OL');
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
  });

  it('lets aria-label rename the navigation landmark', () => {
    renderBreadcrumbs('パンくず');
    expect(
      screen.getByRole('navigation', { name: 'パンくず' }),
    ).toBeInTheDocument();
  });

  it('marks the last crumb as the current page without a link', () => {
    renderBreadcrumbs();
    const current = screen.getByText('Button');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.tagName).toBe('SPAN');
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('hides the separators from assistive technology', () => {
    renderBreadcrumbs();
    expect(screen.getByText('/')).toHaveAttribute('aria-hidden', 'true');
    expect(
      screen
        .getByRole('navigation')
        .querySelectorAll('span[aria-hidden="true"]'),
    ).toHaveLength(2);
  });
});
