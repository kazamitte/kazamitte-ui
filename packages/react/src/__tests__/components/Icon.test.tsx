import { render } from '@testing-library/react';
import { Check } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { Icon } from '../../components/Icon';

describe('Icon', () => {
  it('is decorative and hidden without a label', () => {
    const { container } = render(<Icon icon={Check} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('becomes an image named by the label', () => {
    const { container } = render(<Icon icon={Check} label="完了" size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', '完了');
    expect(svg).not.toHaveAttribute('aria-hidden', 'true');
  });
});
