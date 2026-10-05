import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Button } from '../../components/Button';

describe('browser test environment', () => {
  it('applies the shipped stylesheet, so colors are real', () => {
    render(<Button>保存</Button>);
    const button = screen.getByRole('button', { name: '保存' });
    expect(getComputedStyle(button).backgroundColor).not.toBe(
      'rgba(0, 0, 0, 0)',
    );
  });

  it('switches the tokens when the page is in dark mode', () => {
    render(<Button>保存</Button>);
    const body = getComputedStyle(document.body).backgroundColor;
    document.documentElement.dataset.mode = 'dark';
    expect(getComputedStyle(document.body).backgroundColor).not.toBe(body);
  });

  it('moves focus with a real Tab key press', async () => {
    render(
      <>
        <Button>前へ</Button>
        <Button>次へ</Button>
      </>,
    );
    await userEvent.keyboard('{Tab}');
    expect(screen.getByRole('button', { name: '前へ' })).toHaveFocus();
    await userEvent.keyboard('{Tab}');
    expect(screen.getByRole('button', { name: '次へ' })).toHaveFocus();
  });
});
