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

  it('keeps the semantic level when the visual size is changed', () => {
    render(
      <Heading level={2} size="display-64">
        大きな見出し
      </Heading>,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: '大きな見出し' }),
    ).toBeInTheDocument();
  });
});
