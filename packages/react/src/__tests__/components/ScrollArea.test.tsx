import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { ScrollArea } from '../../components/ScrollArea';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const scrollbars = (container: HTMLElement) =>
  container.querySelectorAll(
    '[data-scope="scroll-area"][data-part="scrollbar"]',
  );

describe('ScrollArea', () => {
  it('renders the content inside a viewport with one vertical scrollbar by default', () => {
    const { container } = render(
      <ScrollArea className="h-24">
        <p>長い本文</p>
      </ScrollArea>,
    );
    expect(screen.getByText('長い本文')).toBeInTheDocument();
    const viewport = container.querySelector('[data-part="viewport"]');
    expect(viewport).toContainElement(screen.getByText('長い本文'));
    const bars = scrollbars(container);
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute('data-orientation', 'vertical');
  });

  it('renders only a horizontal scrollbar for orientation="horizontal"', () => {
    const { container } = render(
      <ScrollArea orientation="horizontal">
        <p>横に長い本文</p>
      </ScrollArea>,
    );
    const bars = scrollbars(container);
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders both scrollbars and a corner for orientation="both"', () => {
    const { container } = render(
      <ScrollArea orientation="both" className="h-24">
        <p>縦横に長い本文</p>
      </ScrollArea>,
    );
    expect(scrollbars(container)).toHaveLength(2);
    expect(container.querySelector('[data-part="corner"]')).toBeInTheDocument();
  });

  it('merges className onto the root, which the caller sizes', () => {
    const { container } = render(
      <ScrollArea className="h-48">
        <p>本文</p>
      </ScrollArea>,
    );
    expect(container.querySelector('[data-part="root"]')).toHaveClass('h-48');
  });
});
