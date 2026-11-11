import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const markerOf = (id: string) => {
  const style = getComputedStyle(screen.getByTestId(id));
  return {
    width: style.borderInlineStartWidth,
    color: style.borderInlineStartColor,
    background: style.backgroundColor,
    paddingStart: style.paddingInlineStart,
  };
};

describe('current-marker', () => {
  it('draws a 4px bar and a tinted background when aria-current is set', () => {
    render(
      <>
        <p data-testid="plain" className="current-marker">
          他の項目
        </p>
        <p data-testid="current" aria-current="true" className="current-marker">
          いま入力中
        </p>
      </>,
    );
    const plain = markerOf('plain');
    const current = markerOf('current');
    expect(plain.width).toBe('0px');
    expect(current.width).toBe('4px');
    expect(current.color).not.toBe(plain.color);
    expect(current.background).not.toBe(plain.background);
  });

  it('takes the bar width out of the start padding so content does not move', () => {
    render(
      <>
        <p data-testid="plain" className="current-marker">
          他の項目
        </p>
        <p data-testid="current" aria-current="step" className="current-marker">
          いま入力中
        </p>
      </>,
    );
    const total = (id: string) =>
      parseFloat(markerOf(id).paddingStart) + parseFloat(markerOf(id).width);
    expect(total('current')).toBe(total('plain'));
    expect(markerOf('current').paddingStart).not.toBe(
      markerOf('plain').paddingStart,
    );
  });

  it('shows no marker for aria-current="false"', () => {
    render(
      <p data-testid="off" aria-current="false" className="current-marker">
        印なし
      </p>,
    );
    expect(markerOf('off').width).toBe('0px');
  });
});
