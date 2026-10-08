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
      <ScrollArea aria-label="本文" className="h-24">
        <p>長い本文</p>
      </ScrollArea>,
    );
    const viewport = container.querySelector('[data-part="viewport"]');
    expect(viewport).toContainElement(screen.getByText('長い本文'));
    const bars = scrollbars(container);
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute('data-orientation', 'vertical');
  });

  it('makes the focusable viewport a region named by aria-label', () => {
    render(
      <ScrollArea aria-label="利用規約">
        <p>本文</p>
      </ScrollArea>,
    );
    expect(screen.getByRole('region', { name: '利用規約' })).toContainElement(
      screen.getByText('本文'),
    );
  });

  it('names the region from aria-labelledby', () => {
    render(
      <>
        <h2 id="terms">利用規約</h2>
        <ScrollArea aria-labelledby="terms">
          <p>本文</p>
        </ScrollArea>
      </>,
    );
    expect(screen.getByRole('region', { name: '利用規約' })).toBeVisible();
  });

  it('requires a name at the type level (typecheck guard, enforced by tsc)', () => {
    // @ts-expect-error a scroll area needs aria-label or aria-labelledby
    const unnamed = <ScrollArea>本文</ScrollArea>;
    expect(unnamed).toBeDefined();
  });

  it('renders only a horizontal scrollbar for orientation="horizontal"', () => {
    const { container } = render(
      <ScrollArea aria-label="本文" orientation="horizontal">
        <p>横に長い本文</p>
      </ScrollArea>,
    );
    const bars = scrollbars(container);
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders both scrollbars and a corner for orientation="both"', () => {
    const { container } = render(
      <ScrollArea aria-label="本文" orientation="both" className="h-24">
        <p>縦横に長い本文</p>
      </ScrollArea>,
    );
    expect(scrollbars(container)).toHaveLength(2);
    expect(container.querySelector('[data-part="corner"]')).toBeInTheDocument();
  });

  it('merges className onto the root, which the caller sizes', () => {
    const { container } = render(
      <ScrollArea aria-label="本文" className="h-48">
        <p>本文</p>
      </ScrollArea>,
    );
    expect(container.querySelector('[data-part="root"]')).toHaveClass('h-48');
  });
});
