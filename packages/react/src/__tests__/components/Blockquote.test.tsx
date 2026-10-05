import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Blockquote } from '../../components/Blockquote';

describe('Blockquote', () => {
  it('renders a blockquote with its source in a footer', () => {
    render(
      <Blockquote.Root cite="https://example.com/wcag">
        <Blockquote.Content>すべての人に。</Blockquote.Content>
        <Blockquote.Caption>
          <cite>WCAG 2.2</cite>
        </Blockquote.Caption>
      </Blockquote.Root>,
    );
    const quote = screen.getByText('すべての人に。').closest('blockquote');
    expect(quote).toHaveAttribute('cite', 'https://example.com/wcag');
    expect(screen.getByText('WCAG 2.2').closest('footer')).not.toBeNull();
  });
});
