import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VisuallyHidden } from '../../components/VisuallyHidden';

describe('VisuallyHidden', () => {
  it('keeps the text in the accessibility tree while hiding it visually', () => {
    render(
      <button type="button">
        <VisuallyHidden>閉じる</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button', { name: '閉じる' })).toBeInTheDocument();
    expect(screen.getByText('閉じる')).toHaveClass('sr-only');
  });

  it('applies the hiding to the child element with asChild', () => {
    render(
      <VisuallyHidden asChild>
        <h2>ナビゲーション</h2>
      </VisuallyHidden>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('sr-only');
  });
});
