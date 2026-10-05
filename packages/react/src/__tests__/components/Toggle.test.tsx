import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from '../../components/Toggle';
import { VisuallyHidden } from '../../components/VisuallyHidden';

describe('Toggle', () => {
  it('renders a button that reports its pressed state', () => {
    render(<Toggle>太字</Toggle>);
    const button = screen.getByRole('button', { name: '太字' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('toggles on click and forwards onPressedChange', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>太字</Toggle>);
    const button = screen.getByRole('button', { name: '太字' });

    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenLastCalledWith(true);

    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(onPressedChange).toHaveBeenLastCalledWith(false);
  });

  it('follows a controlled pressed prop', () => {
    render(<Toggle pressed>太字</Toggle>);
    expect(screen.getByRole('button', { name: '太字' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('is named by a visually hidden label when icon-only', () => {
    render(
      <Toggle>
        <svg aria-hidden="true" />
        <VisuallyHidden>お気に入り</VisuallyHidden>
      </Toggle>,
    );
    expect(
      screen.getByRole('button', { name: 'お気に入り' }),
    ).toBeInTheDocument();
  });

  it('cannot be pressed when disabled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle disabled onPressedChange={onPressedChange}>
        太字
      </Toggle>,
    );
    const button = screen.getByRole('button', { name: '太字' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onPressedChange).not.toHaveBeenCalled();
  });
});
