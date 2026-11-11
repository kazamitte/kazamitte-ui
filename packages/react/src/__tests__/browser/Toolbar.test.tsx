import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Toolbar } from '../../components/Toolbar';

const renderToolbar = () =>
  render(
    <>
      <button type="button">前</button>
      <Toolbar.Root aria-label="書式">
        <Toolbar.Button>太字</Toolbar.Button>
        <Toolbar.Button>斜体</Toolbar.Button>
        <Toolbar.Button>下線</Toolbar.Button>
      </Toolbar.Root>
      <button type="button">後</button>
    </>,
  );

describe('Toolbar', () => {
  it('passes through the toolbar with one Tab each way and returns to the last item', async () => {
    renderToolbar();
    screen.getByRole('button', { name: '前' }).focus();
    await userEvent.tab();
    const bold = screen.getByRole('button', { name: '太字' });
    await expect.poll(() => bold === document.activeElement).toBe(true);

    await userEvent.keyboard('{ArrowRight}');
    const italic = screen.getByRole('button', { name: '斜体' });
    await expect.poll(() => italic === document.activeElement).toBe(true);

    await userEvent.tab();
    const after = screen.getByRole('button', { name: '後' });
    await expect.poll(() => after === document.activeElement).toBe(true);
    await userEvent.tab({ shift: true });
    await expect.poll(() => italic === document.activeElement).toBe(true);
  });

  it('draws a focus ring on the item reached by the keyboard', async () => {
    renderToolbar();
    screen.getByRole('button', { name: '前' }).focus();
    await userEvent.tab();
    const style = getComputedStyle(
      screen.getByRole('button', { name: '太字' }),
    );
    expect(style.outlineStyle).not.toBe('none');
    expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2);
  });
});
