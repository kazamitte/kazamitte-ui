import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, initialsOf } from '../../components/Avatar';
import { AvatarGroup } from '../../components/AvatarGroup';

describe('initialsOf', () => {
  it.each([
    ['山田 太郎', '山太'],
    ['Ada Lovelace', 'AL'],
    ['kazami', 'k'],
    ['  ', ''],
  ])('turns %s into %s', (name, initials) => {
    expect(initialsOf(name)).toBe(initials);
  });
});

describe('Avatar', () => {
  it('shows the initials named after the person while there is no image', () => {
    render(<Avatar name="山田 太郎" />);
    const fallback = screen.getByLabelText('山田 太郎');
    expect(fallback).toHaveTextContent('山太');
    expect(fallback).toBeVisible();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the image with the name as alt text, hidden until it loads', () => {
    render(
      <Avatar name="山田 太郎" src="https://example.com/a.png" size="lg" />,
    );
    const image = screen.getByAltText('山田 太郎');
    expect(image).toHaveAttribute('src', 'https://example.com/a.png');
    expect(image).not.toBeVisible();
  });
});

describe('AvatarGroup', () => {
  it('lists up to max avatars and counts the rest', () => {
    render(
      <AvatarGroup max={2} size="sm">
        <Avatar name="A" />
        <Avatar name="B" />
        <Avatar name="C" />
        <Avatar name="D" />
      </AvatarGroup>,
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByLabelText(/^[A-D]$/)).toHaveLength(2);
  });

  it('names the hidden members on the overflow item instead of a bare +N', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="山田 太郎" />
        <Avatar name="鈴木 花子" />
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
      </AvatarGroup>,
    );
    const overflow = screen.getAllByRole('listitem').at(-1);
    expect(overflow).toHaveTextContent('ほか2人: Ada Lovelace、Grace Hopper');
  });

  it('falls back to a plain count when a hidden child has no name prop', () => {
    render(
      <AvatarGroup max={1}>
        <Avatar name="山田 太郎" />
        <span>装飾</span>
      </AvatarGroup>,
    );
    const overflow = screen.getAllByRole('listitem').at(-1);
    expect(overflow).toHaveTextContent(/ほか1人$/);
  });
});
