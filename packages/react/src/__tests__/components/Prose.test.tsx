import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Prose } from '../../components/Prose';

describe('Prose', () => {
  it('renders its children as plain elements with no added roles', () => {
    render(
      <Prose data-testid="prose">
        <h2>見出し</h2>
        <p>
          本文と<a href="#a">リンク</a>
        </p>
        <ul>
          <li>
            <input type="checkbox" disabled /> 済み
          </li>
        </ul>
      </Prose>,
    );
    expect(screen.getByRole('heading', { name: '見出し' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'リンク' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(screen.getByTestId('prose').getAttribute('role')).toBeNull();
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Prose ref={ref} className="max-w-prose" data-testid="prose" />);
    expect(ref.current).toBe(screen.getByTestId('prose'));
    expect(ref.current).toHaveClass('max-w-prose');
  });
});
