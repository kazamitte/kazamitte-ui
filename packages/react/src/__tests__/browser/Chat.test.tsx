import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Chat } from '../../components/Chat';

// The text a screen reader walks through, in order: every text node that is
// not inside an aria-hidden subtree.
const spokenText = (root: Element): string[] => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement?.closest('[aria-hidden="true"]')
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  const texts: string[] = [];
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent?.trim();
    if (text) texts.push(text);
  }
  return texts;
};

const LONG = 'https://example.com/' + 'a'.repeat(300);

const Log = ({ autoScroll }: { autoScroll?: boolean }) => {
  const [count, setCount] = useState(20);
  return (
    <>
      <button type="button" onClick={() => setCount(count + 1)}>
        追加
      </button>
      <Chat.Root
        aria-label="連絡"
        autoScroll={autoScroll}
        data-testid="log"
        style={{ height: 200 }}
      >
        <Chat.Group>
          {Array.from({ length: count }, (_, i) => (
            <Chat.Bubble key={i}>発言 {i}</Chat.Bubble>
          ))}
        </Chat.Group>
      </Chat.Root>
    </>
  );
};

const distanceFromBottom = (el: HTMLElement) =>
  el.scrollHeight - el.scrollTop - el.clientHeight;

describe('Chat', () => {
  it('reads the sender, then the time, then the message', () => {
    render(
      <Chat.Root aria-label="連絡">
        <Chat.Group data-testid="group">
          <Chat.Header>
            <Chat.Avatar name="森下課長" />
            <Chat.Sender>森下課長</Chat.Sender>
            <Chat.Time dateTime="2026-11-14T14:05">14:05</Chat.Time>
          </Chat.Header>
          <Chat.Bubble>日程を決めましょう。</Chat.Bubble>
        </Chat.Group>
      </Chat.Root>,
    );
    expect(spokenText(screen.getByTestId('group'))).toEqual([
      '森下課長',
      '14:05',
      '日程を決めましょう。',
    ]);
  });

  it('wraps a long URL inside the bubble instead of overflowing', () => {
    render(
      <div style={{ width: 320 }}>
        <Chat.Root aria-label="連絡">
          <Chat.Group>
            <Chat.Bubble data-testid="bubble">{LONG}</Chat.Bubble>
          </Chat.Group>
        </Chat.Root>
      </div>,
    );
    const bubble = screen.getByTestId('bubble');
    expect(bubble.scrollWidth).toBeLessThanOrEqual(bubble.clientWidth);
    // 80% of the log's content box, never the full width.
    expect(bubble.getBoundingClientRect().width).toBeLessThan(320 * 0.85);
  });

  it('starts at the bottom and follows a new message', async () => {
    render(<Log />);
    const log = screen.getByTestId('log');
    expect(distanceFromBottom(log)).toBeLessThanOrEqual(1);

    await userEvent.click(screen.getByRole('button', { name: '追加' }));
    await expect.poll(() => distanceFromBottom(log)).toBeLessThanOrEqual(1);
  });

  it('stays put while the reader has scrolled up', async () => {
    render(<Log />);
    const log = screen.getByTestId('log');
    log.scrollTop = 0;
    await expect.poll(() => log.scrollTop).toBe(0);

    await userEvent.click(screen.getByRole('button', { name: '追加' }));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(log.scrollTop).toBe(0);
  });

  it('does not move with autoScroll off', async () => {
    render(<Log autoScroll={false} />);
    const log = screen.getByTestId('log');
    expect(log.scrollTop).toBe(0);

    await userEvent.click(screen.getByRole('button', { name: '追加' }));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(log.scrollTop).toBe(0);
  });
});
