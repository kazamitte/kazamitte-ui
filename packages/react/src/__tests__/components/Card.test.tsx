import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '../../components/Card';

const parts = (
  <>
    <Card.Header>
      <Card.Title>Button</Card.Title>
      <Card.Description>native button のラッパー</Card.Description>
    </Card.Header>
    <Card.Body>本文</Card.Body>
    <Card.Footer>フッター</Card.Footer>
  </>
);

describe('Card', () => {
  it('renders a static surface with an h3 title by default', () => {
    render(<Card.Root data-testid="card">{parts}</Card.Root>);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Button' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('card').tagName).toBe('DIV');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('stays a non-link when interactive is set without href', () => {
    render(<Card.Root interactive>{parts}</Card.Root>);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders the child element as the card with asChild', () => {
    render(
      <Card.Root asChild>
        <section aria-label="商品">{parts}</section>
      </Card.Root>,
    );
    expect(screen.getByRole('region', { name: '商品' })).toBeInTheDocument();
  });

  it('becomes one link when href is given', () => {
    render(<Card.Root href="https://example.com/button">{parts}</Card.Root>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/button');
    expect(link).toHaveTextContent('Button');
  });

  it('lets the title take another heading level with asChild', () => {
    render(
      <Card.Root>
        <Card.Title asChild>
          <h2>Tabs</h2>
        </Card.Title>
      </Card.Root>,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Tabs' }),
    ).toBeInTheDocument();
  });
});
