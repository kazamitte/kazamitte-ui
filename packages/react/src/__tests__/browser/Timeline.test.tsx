import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline } from '../../components/Timeline';

describe('Timeline', () => {
  it('pulses the active halo twice, under the 5s WCAG 2.2.2 allows', () => {
    const { container } = render(
      <Timeline.Root>
        <Timeline.Item state="active">
          <Timeline.Marker />
          <Timeline.When>10:00</Timeline.When>
          <Timeline.Content>会議資料の作成</Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>,
    );
    const halo = container.querySelector('[data-part="halo"]');
    if (halo === null) throw new Error('no halo');
    const style = getComputedStyle(halo);
    expect(style.animationIterationCount).toBe('2');
    const seconds = Number.parseFloat(style.animationDuration);
    expect(seconds * 2).toBeLessThanOrEqual(5);
  });

  it('centers the active dot inside its halo', () => {
    const { container } = render(
      <Timeline.Root>
        <Timeline.Item state="active">
          <Timeline.Marker />
          <Timeline.When>10:00</Timeline.When>
          <Timeline.Content>会議資料の作成</Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>,
    );
    const box = (part: string) => {
      const el = container.querySelector(`[data-part="${part}"]`);
      if (el === null) throw new Error(`no ${part}`);
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const halo = box('halo');
    const dot = box('dot');
    expect(Math.abs(halo.x - dot.x)).toBeLessThan(0.5);
    expect(Math.abs(halo.y - dot.y)).toBeLessThan(0.5);
  });
});
