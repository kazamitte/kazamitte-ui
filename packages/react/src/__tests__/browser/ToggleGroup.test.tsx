import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { ToggleGroup } from '../../components/ToggleGroup';

const ITEMS = [
  { value: 'bold', label: '太字' },
  { value: 'italic', label: '斜体' },
  { value: 'underline', label: '下線' },
];

describe('ToggleGroup', () => {
  it('gives only the focused item a tabIndex of 0, the rest -1', async () => {
    render(<ToggleGroup items={ITEMS} defaultValue={['bold']} />);
    const bold = screen.getByRole('radio', { name: '太字' });
    bold.focus();
    await expect.poll(() => bold.getAttribute('tabindex')).toBe('0');
    expect(screen.getByRole('radio', { name: '斜体' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
    expect(screen.getByRole('radio', { name: '下線' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('moves the focus and the tab stop with ArrowRight without changing the selection', async () => {
    render(<ToggleGroup items={ITEMS} defaultValue={['bold']} />);
    screen.getByRole('radio', { name: '太字' }).focus();
    await userEvent.keyboard('{ArrowRight}');

    const italic = screen.getByRole('radio', { name: '斜体' });
    await expect.poll(() => italic === document.activeElement).toBe(true);
    await expect.poll(() => italic.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() =>
        screen.getByRole('radio', { name: '太字' }).getAttribute('tabindex'),
      )
      .toBe('-1');
    expect(italic).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: '太字' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('selects the focused item when Enter is pressed', async () => {
    render(<ToggleGroup items={ITEMS} defaultValue={['bold']} />);
    screen.getByRole('radio', { name: '太字' }).focus();
    const italic = screen.getByRole('radio', { name: '斜体' });
    await userEvent.keyboard('{ArrowRight}');
    await expect.poll(() => italic === document.activeElement).toBe(true);
    await userEvent.keyboard('{Enter}');

    await expect.poll(() => italic.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: '太字' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('wraps ArrowLeft from the first item to the last', async () => {
    render(<ToggleGroup items={ITEMS} defaultValue={['bold']} />);
    screen.getByRole('radio', { name: '太字' }).focus();
    await userEvent.keyboard('{ArrowLeft}');

    const underline = screen.getByRole('radio', { name: '下線' });
    await expect.poll(() => underline === document.activeElement).toBe(true);
  });

  it('jumps the tab stop to the first and last item with Home and End', async () => {
    render(<ToggleGroup items={ITEMS} defaultValue={['bold']} />);
    screen.getByRole('radio', { name: '太字' }).focus();
    await userEvent.keyboard('{End}');
    const underline = screen.getByRole('radio', { name: '下線' });
    await expect.poll(() => underline === document.activeElement).toBe(true);

    await userEvent.keyboard('{Home}');
    const bold = screen.getByRole('radio', { name: '太字' });
    await expect.poll(() => bold === document.activeElement).toBe(true);
  });
});
