import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline, type TimelineState } from '../../components/Timeline';

const renderItem = (state?: TimelineState, label?: string) =>
  render(
    <Timeline.Root aria-label="今日の予定">
      <Timeline.Item state={state}>
        <Timeline.Marker label={label} />
        <Timeline.When>10:00</Timeline.When>
        <Timeline.Content>会議資料の作成</Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>,
  );

describe('Timeline', () => {
  it('is an ordered list of items', () => {
    renderItem();
    expect(screen.getByRole('list', { name: '今日の予定' }).tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('speaks the active state before the time', () => {
    renderItem('active');
    expect(screen.getByRole('listitem')).toHaveTextContent(
      '進行中10:00会議資料の作成',
    );
  });

  it('speaks the done state before the time', () => {
    renderItem('done');
    expect(screen.getByRole('listitem')).toHaveTextContent(
      '完了10:00会議資料の作成',
    );
  });

  it('says nothing extra for the default state', () => {
    renderItem();
    expect(screen.getByRole('listitem')).toHaveTextContent(
      /^10:00会議資料の作成$/,
    );
  });

  it('lets the caller replace the spoken state', () => {
    renderItem('active', '現在');
    expect(screen.getByRole('listitem')).toHaveTextContent(
      '現在10:00会議資料の作成',
    );
  });

  it('hides the dot and the line from assistive technology', () => {
    const { container } = renderItem('done');
    const dot = container.querySelector('[data-part="dot"]');
    const line = container.querySelector('[data-part="line"]');
    expect(dot?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(line).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the time element passed through When asChild', () => {
    render(
      <Timeline.Root>
        <Timeline.Item>
          <Timeline.Marker />
          <Timeline.When asChild>
            <time dateTime="09:00">9:00</time>
          </Timeline.When>
          <Timeline.Content>朝礼</Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>,
    );
    expect(screen.getByText('9:00').tagName).toBe('TIME');
    expect(screen.getByText('9:00')).toHaveAttribute('datetime', '09:00');
  });
});
