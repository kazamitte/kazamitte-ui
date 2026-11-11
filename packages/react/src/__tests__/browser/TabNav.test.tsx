import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { TabNav } from '../../components/TabNav';

describe('TabNav', () => {
  it('draws the focus ring inside the link so a scrolling list does not clip it', async () => {
    render(
      <TabNav.Root aria-label="設定">
        <TabNav.List>
          <TabNav.Link href="#a" current>
            プロフィール
          </TabNav.Link>
          <TabNav.Link href="#b">請求</TabNav.Link>
        </TabNav.List>
      </TabNav.Root>,
    );
    await userEvent.tab();
    const link = screen.getByRole('link', { name: 'プロフィール' });
    await expect.poll(() => link === document.activeElement).toBe(true);
    const style = getComputedStyle(link);
    expect(style.outlineStyle).not.toBe('none');
    expect(Number.parseFloat(style.outlineOffset)).toBeLessThan(0);
  });

  it('scrolls the list sideways instead of wrapping when the links overflow', () => {
    render(
      <div style={{ width: 160 }}>
        <TabNav.Root aria-label="設定">
          <TabNav.List>
            {['プロフィール', 'セキュリティ', '請求', '通知'].map((name) => (
              <TabNav.Link key={name} href={`#${name}`}>
                {name}
              </TabNav.Link>
            ))}
          </TabNav.List>
        </TabNav.Root>
      </div>,
    );
    const list = screen.getByRole('list');
    expect(getComputedStyle(list).overflowX).toBe('auto');
    expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
  });
});
