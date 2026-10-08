import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from '../../components/Spinner';

describe('Spinner', () => {
  it('is a status region announcing the loading label', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveTextContent('読み込み中');
  });

  it('takes a custom label', () => {
    render(<Spinner label="保存しています" size="sm" />);
    expect(screen.getByRole('status')).toHaveTextContent('保存しています');
  });

  it('renders as a hidden glyph with no status role when decorative', () => {
    render(<Spinner decorative data-testid="glyph" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    const glyph = screen.getByTestId('glyph');
    expect(glyph.tagName).toBe('SPAN');
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
  });
});
