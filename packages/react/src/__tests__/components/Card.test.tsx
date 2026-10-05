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
    render(<Card.Root>{parts}</Card.Root>);
    const title = screen.getByRole('heading', { level: 3, name: 'Button' });
    const root = title.closest('[class]')?.parentElement?.parentElement;
    expect(root?.tagName).toBe('DIV');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
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
