import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Chat } from '../../components/Chat';

const renderChat = () =>
  render(
    <Chat.Root aria-label="森下課長との連絡">
      <Chat.Group side="start" data-testid="group">
        <Chat.Header>
          <Chat.Avatar name="森下課長" />
          <Chat.Sender>森下課長</Chat.Sender>
          <Chat.Time dateTime="2026-11-14T14:05">14:05</Chat.Time>
        </Chat.Header>
        <Chat.Bubble>日程を決めましょう。</Chat.Bubble>
      </Chat.Group>
    </Chat.Root>,
  );

describe('Chat', () => {
  it('is a named log that keyboard users can focus to scroll', () => {
    renderChat();
    const log = screen.getByRole('log', { name: '森下課長との連絡' });
    expect(log).toHaveAttribute('tabindex', '0');
  });

  it('hides the avatar so the name is not read twice', () => {
    renderChat();
    expect(
      screen.getByLabelText('森下課長').closest('[aria-hidden="true"]'),
    ).not.toBeNull();
  });

  it('marks the time with a machine-readable datetime', () => {
    renderChat();
    const time = screen.getByText('14:05');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2026-11-14T14:05');
  });

  it('tells the caller which side a group sits on', () => {
    renderChat();
    expect(screen.getByTestId('group')).toHaveAttribute('data-side', 'start');
  });
});
