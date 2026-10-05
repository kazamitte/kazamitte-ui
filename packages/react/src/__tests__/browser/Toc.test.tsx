import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toc } from '../../components/Toc';

const ITEMS = [
  { value: 'one', depth: 2, label: '一' },
  { value: 'two', depth: 2, label: '二' },
  { value: 'three', depth: 2, label: '三' },
  { value: 'four', depth: 2, label: '四' },
];

const renderPage = (onActiveChange?: () => void) => {
  render(
    <div className="flex">
      <div data-testid="scroller" className="h-[400px] w-96 overflow-y-auto">
        {ITEMS.map(({ value, label }, index) => (
          <section key={value} className={index === 3 ? 'h-24' : 'h-[800px]'}>
            <h2 id={value}>{label}</h2>
          </section>
        ))}
      </div>
      <Toc
        items={ITEMS}
        scrollEl={() => screen.getByTestId('scroller')}
        onActiveChange={onActiveChange}
        className="w-48"
      />
    </div>,
  );
  return screen.getByTestId('scroller');
};

const scrollTo = (el: HTMLElement, top: number) => {
  el.scrollTo({ top, behavior: 'instant' });
};

const currentLabels = () =>
  screen
    .getAllByRole('link')
    .filter((link) => link.getAttribute('aria-current') === 'location')
    .map((link) => link.textContent);

describe('Toc', () => {
  it('marks the first heading before any scrolling', async () => {
    renderPage();
    await expect.poll(currentLabels).toEqual(['一']);
  });

  it('marks the one section whose heading has passed the reading line', async () => {
    const scroller = renderPage();
    scrollTo(scroller, 900);
    await expect.poll(currentLabels).toEqual(['二']);
  });

  it('moves back to the section above when scrolling up into it', async () => {
    const scroller = renderPage();
    scrollTo(scroller, 1700);
    await expect.poll(currentLabels).toEqual(['三']);
    scrollTo(scroller, 1300);
    await expect.poll(currentLabels).toEqual(['二']);
  });

  it('marks the last heading at the bottom even if it never reaches the line', async () => {
    const scroller = renderPage();
    scrollTo(scroller, scroller.scrollHeight);
    await expect.poll(currentLabels).toEqual(['四']);
  });

  it('reports the new current heading when it changes', async () => {
    const onActiveChange = vi.fn();
    const scroller = renderPage(onActiveChange);
    scrollTo(scroller, 900);
    await expect
      .poll(() => onActiveChange.mock.lastCall?.[0]?.activeIds)
      .toEqual(['two']);
  });
});
