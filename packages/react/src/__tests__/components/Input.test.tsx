import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';

describe('Input', () => {
  it('uses the visual size prop, not the native character count', () => {
    render(<Input aria-label="名前" size="sm" />);
    const input = screen.getByRole('textbox', { name: '名前' });
    expect(input).not.toHaveAttribute('size');
  });

  it('forwards the native invalid and disabled states', () => {
    render(<Input aria-label="名前" aria-invalid disabled />);
    const input = screen.getByRole('textbox', { name: '名前' });
    expect(input).toBeInvalid();
    expect(input).toBeDisabled();
  });
});

describe('Textarea', () => {
  it('renders a multi-line text box', () => {
    render(<Textarea aria-label="本文" size="lg" />);
    const textarea = screen.getByRole('textbox', { name: '本文' });
    expect(textarea.tagName).toBe('TEXTAREA');
  });
});
