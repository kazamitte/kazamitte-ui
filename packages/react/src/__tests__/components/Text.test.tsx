import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from '../../components/Text';

describe('Text', () => {
  it('renders a paragraph in the body-16 style by default', () => {
    render(<Text>本文</Text>);
    const text = screen.getByText('本文');
    expect(text.tagName).toBe('P');
    expect(text).toHaveClass('text-body-16');
  });

  it('applies the chosen text style, weight and truncation', () => {
    render(
      <Text textStyle="dense-14" weight="bold" truncate>
        本文
      </Text>,
    );
    expect(screen.getByText('本文')).toHaveClass(
      'text-dense-14',
      'font-bold',
      'truncate',
    );
  });

  it('renders the child element in place of a paragraph with asChild', () => {
    render(
      <Text asChild textStyle="oneline-14">
        <span>ラベル</span>
      </Text>,
    );
    const label = screen.getByText('ラベル');
    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveClass('text-oneline-14');
  });
});
