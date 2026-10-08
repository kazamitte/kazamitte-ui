import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Editable } from '../../components/Editable';

describe('Editable', () => {
  it('shows the value as a focusable preview and hides the input until editing', () => {
    render(<Editable label="表示名" defaultValue="かざみ" />);
    const preview = screen.getByText('かざみ');
    expect(preview).toHaveAttribute('tabindex', '0');
    expect(screen.getByLabelText('表示名')).not.toBeVisible();
  });

  it('enters edit mode on click, saves on Enter and reports the committed value', async () => {
    const user = userEvent.setup();
    const onValueCommit = vi.fn();
    render(
      <Editable
        label="表示名"
        defaultValue="かざみ"
        onValueCommit={onValueCommit}
      />,
    );
    await user.click(screen.getByText('かざみ'));
    const input = screen.getByLabelText('表示名');
    await waitFor(() => expect(input).toBeVisible());
    await user.clear(input);
    await user.type(input, 'kazami');
    await waitFor(() => expect(input).toHaveValue('kazami'));
    await user.keyboard('{Enter}');
    expect(onValueCommit).toHaveBeenCalledWith({ value: 'kazami' });
    await waitFor(() => expect(screen.getByText('kazami')).toBeVisible());
  });

  it('reverts the change on Escape', async () => {
    const user = userEvent.setup();
    const onValueCommit = vi.fn();
    render(
      <Editable
        label="表示名"
        defaultValue="かざみ"
        onValueCommit={onValueCommit}
      />,
    );
    await user.click(screen.getByText('かざみ'));
    const input = screen.getByLabelText('表示名');
    await user.type(input, 'X{Escape}');
    expect(onValueCommit).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText('かざみ')).toBeVisible());
  });

  it('waits for a double click when activationMode is dblclick', async () => {
    const user = userEvent.setup();
    render(
      <Editable
        label="表示名"
        defaultValue="かざみ"
        activationMode="dblclick"
      />,
    );
    await user.click(screen.getByText('かざみ'));
    expect(screen.getByLabelText('表示名')).not.toBeVisible();
    await user.dblClick(screen.getByText('かざみ'));
    await waitFor(() => expect(screen.getByLabelText('表示名')).toBeVisible());
  });

  it('renders Japanese edit, save and cancel buttons when controls is set', async () => {
    const user = userEvent.setup();
    const onValueCommit = vi.fn();
    render(
      <Editable
        label="表示名"
        defaultValue="かざみ"
        controls
        submitMode="none"
        onValueCommit={onValueCommit}
      />,
    );
    await user.click(screen.getByRole('button', { name: '編集' }));
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'キャンセル' }),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText('表示名'), '2');
    await user.click(screen.getByRole('button', { name: '保存' }));
    expect(onValueCommit).toHaveBeenCalledWith({ value: 'かざみ2' });
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
  });

  it('reverts the value and skips the commit when Cancel is pressed in controls mode', async () => {
    const user = userEvent.setup();
    const onValueCommit = vi.fn();
    render(
      <Editable
        label="表示名"
        defaultValue="かざみ"
        controls
        submitMode="none"
        onValueCommit={onValueCommit}
      />,
    );
    await user.click(screen.getByRole('button', { name: '編集' }));
    await user.type(screen.getByLabelText('表示名'), '2');
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(onValueCommit).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText('かざみ')).toBeVisible());
    expect(screen.queryByText('かざみ2')).not.toBeInTheDocument();
  });

  it('lets a translations override rename one button and keeps the other defaults', async () => {
    const user = userEvent.setup();
    render(
      <Editable
        label="表示名"
        defaultValue="かざみ"
        controls
        translations={{ edit: 'Edit' }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'キャンセル' }),
    ).toBeInTheDocument();
  });

  it('edits in a textarea when multiline is set', () => {
    render(<Editable label="自己紹介" defaultValue="はじめまして" multiline />);
    expect(screen.getByLabelText('自己紹介').tagName).toBe('TEXTAREA');
  });
});
