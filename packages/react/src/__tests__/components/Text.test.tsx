import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from '../../components/Text';

describe('Text', () => {
  it('renders a paragraph in the body-16 style by default', () => {
    render(<Text>本文</Text>);
    const text = screen.getByText('本文');
    expect(text.tagName).toBe('P');
  });

  it('renders the child element in place of a paragraph with asChild', () => {
    render(
      <Text asChild textStyle="oneline-14">
        <span>ラベル</span>
      </Text>,
    );
    const label = screen.getByText('ラベル');
    expect(label.tagName).toBe('SPAN');
  });
});
