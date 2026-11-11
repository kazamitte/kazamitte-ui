import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import { TabNav } from '../../components/TabNav';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const renderNav = () =>
  render(
    <TabNav.Root aria-label="設定">
      <TabNav.List>
        <TabNav.Link href="/profile" current>
          プロフィール
        </TabNav.Link>
        <TabNav.Link href="/security">セキュリティ</TabNav.Link>
        <TabNav.Link href="/billing">請求</TabNav.Link>
      </TabNav.List>
    </TabNav.Root>,
  );

describe('TabNav', () => {
  it('is a navigation landmark with the given name, holding a list of links', () => {
    renderNav();
    const nav = screen.getByRole('navigation', { name: '設定' });
    expect(nav.tagName).toBe('NAV');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders real anchors with their href', () => {
    renderNav();
    expect(screen.getByRole('link', { name: '請求' })).toHaveAttribute(
      'href',
      '/billing',
    );
  });

  it('marks only the current link with aria-current="page" and the selected hook', () => {
    renderNav();
    const current = screen.getByRole('link', { name: 'プロフィール' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveAttribute('data-current');
    const other = screen.getByRole('link', { name: 'セキュリティ' });
    expect(other).not.toHaveAttribute('aria-current');
    expect(other).not.toHaveAttribute('data-current');
  });

  it('keeps every link a tab stop', async () => {
    const user = userEvent.setup();
    renderNav();
    await user.tab();
    expect(screen.getByRole('link', { name: 'プロフィール' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'セキュリティ' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: '請求' })).toHaveFocus();
  });

  it('also moves between links with the arrow keys, Home and End, without wrapping', async () => {
    const user = userEvent.setup();
    renderNav();
    screen.getByRole('link', { name: 'プロフィール' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('link', { name: 'セキュリティ' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('link', { name: '請求' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('link', { name: 'プロフィール' })).toHaveFocus();
    // does not wrap: Tab is the way out
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('link', { name: 'プロフィール' })).toHaveFocus();
  });

  it('renders the child of asChild as the anchor', () => {
    render(
      <TabNav.Root aria-label="設定">
        <TabNav.List>
          <TabNav.Link asChild current>
            <a href="/custom" data-router="yes">
              独自
            </a>
          </TabNav.Link>
        </TabNav.List>
      </TabNav.Root>,
    );
    const link = screen.getByRole('link', { name: '独自' });
    expect(link).toHaveAttribute('data-router', 'yes');
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});
