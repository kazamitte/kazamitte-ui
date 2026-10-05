import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Heading } from '../../components/Heading';

describe('Heading', () => {
  it('renders an h2 by default', () => {
    render(<Heading>見出し</Heading>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('follows the level for the element', () => {
    render(<Heading level={4}>小見出し</Heading>);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });
});
