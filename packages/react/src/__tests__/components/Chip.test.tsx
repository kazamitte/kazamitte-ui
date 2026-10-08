import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from '../../components/Chip';

describe('Chip', () => {
  it('is a plain token without onRemove', () => {
    render(<Chip>デザイン</Chip>);
    expect(screen.getByText('デザイン')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('adds a remove button named after the label', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>デザイン</Chip>);
    await user.click(screen.getByRole('button', { name: 'デザインを削除' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('removes with Enter and Space from the keyboard', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>デザイン</Chip>);
    await user.tab();
    expect(
      screen.getByRole('button', { name: 'デザインを削除' }),
    ).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onRemove).toHaveBeenCalledTimes(2);
  });

  it('names the remove button after label when the children are not text', () => {
    render(
      <Chip onRemove={vi.fn()} label="React">
        <b>React</b>
      </Chip>,
    );
    expect(
      screen.getByRole('button', { name: 'Reactを削除' }),
    ).toBeInTheDocument();
  });
});
