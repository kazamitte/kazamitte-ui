import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Code } from '../../components/Code';
import { Kbd } from '../../components/Kbd';

describe('Kbd', () => {
  it('renders a kbd element for one key', () => {
    render(<Kbd>Enter</Kbd>);
    expect(screen.getByText('Enter').tagName).toBe('KBD');
  });
});

describe('Code', () => {
  it('renders an inline code element', () => {
    render(<Code>pnpm verify</Code>);
    expect(screen.getByText('pnpm verify').tagName).toBe('CODE');
  });
});
