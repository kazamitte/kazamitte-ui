import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { List } from '../../components/List';

describe('List', () => {
  it('keeps a sticky header at the top of a scrolling container', async () => {
    render(
      <div data-testid="scroller" style={{ height: 120, overflowY: 'auto' }}>
        <List.Root>
          <List.Header sticky data-testid="header">
            <h2>タスク</h2>
          </List.Header>
          <List.Items>
            {Array.from({ length: 20 }, (_, i) => (
              <List.Row key={i}>タスク {i}</List.Row>
            ))}
          </List.Items>
        </List.Root>
      </div>,
    );
    const scroller = screen.getByTestId('scroller');
    const header = screen.getByTestId('header');
    scroller.scrollTop = 200;
    await expect.poll(() => scroller.scrollTop).toBeGreaterThan(100);
    const top = header.getBoundingClientRect().top;
    expect(Math.abs(top - scroller.getBoundingClientRect().top)).toBeLessThan(
      2,
    );
  });
});
