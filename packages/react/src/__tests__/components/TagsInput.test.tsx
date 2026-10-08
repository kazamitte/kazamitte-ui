import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagsInput } from '../../components/TagsInput';

describe('TagsInput', () => {
  it('shows the placeholder only while there are no tags', () => {
    const { rerender } = render(
      <TagsInput label="タグ" placeholder="タグを追加" />,
    );
    expect(screen.getByLabelText('タグ')).toHaveAttribute(
      'placeholder',
      'タグを追加',
    );
    rerender(
      <TagsInput label="タグ" placeholder="タグを追加" value={['React']} />,
    );
    expect(screen.getByLabelText('タグ')).not.toHaveAttribute('placeholder');
  });

  it('renders the tags with Japanese delete buttons and a clear button', () => {
    render(<TagsInput label="タグ" defaultValue={['React', 'Vue']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reactを削除' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'すべてのタグを削除' }),
    ).toBeInTheDocument();
  });

  it('adds a tag on Enter and removes one with its delete button', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TagsInput
        label="タグ"
        defaultValue={['React']}
        onValueChange={onValueChange}
      />,
    );
    await user.type(screen.getByLabelText('タグ'), 'Vue{Enter}');
    await waitFor(() => expect(screen.getByText('Vue')).toBeInTheDocument());
    expect(onValueChange).toHaveBeenLastCalledWith({
      value: ['React', 'Vue'],
    });

    await user.click(screen.getByRole('button', { name: 'Reactを削除' }));
    await waitFor(() =>
      expect(screen.queryByText('React')).not.toBeInTheDocument(),
    );
    expect(onValueChange).toHaveBeenLastCalledWith({ value: ['Vue'] });
  });

  it('highlights the last tag on Backspace from the empty input, then deletes it', async () => {
    const user = userEvent.setup();
    render(<TagsInput label="タグ" defaultValue={['React', 'Vue']} />);
    await user.click(screen.getByLabelText('タグ'));
    await user.keyboard('{Backspace}');
    expect(screen.getByText('Vue')).toBeInTheDocument();

    await user.keyboard('{Backspace}');
    await waitFor(() =>
      expect(screen.queryByText('Vue')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('announces added and deleted tags in Japanese', async () => {
    const user = userEvent.setup();
    render(<TagsInput label="タグ" />);
    await user.type(screen.getByLabelText('タグ'), 'Vue{Enter}');
    expect(await screen.findByText('Vueを追加しました')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Vueを削除' }));
    expect(await screen.findByText('Vueを削除しました')).toBeInTheDocument();
  });

  it('empties the value with the clear button and reports it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TagsInput
        label="タグ"
        defaultValue={['React', 'Vue']}
        onValueChange={onValueChange}
      />,
    );
    await user.click(
      screen.getByRole('button', { name: 'すべてのタグを削除' }),
    );
    await waitFor(() =>
      expect(screen.queryByText('React')).not.toBeInTheDocument(),
    );
    expect(onValueChange).toHaveBeenLastCalledWith({ value: [] });
  });

  it('overrides one translation and keeps the other Japanese defaults', () => {
    render(
      <TagsInput
        label="タグ"
        defaultValue={['React']}
        translations={{ clearTriggerLabel: 'Clear' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reactを削除' }),
    ).toBeInTheDocument();
  });

  it('refuses a tag the validate function rejects and reports why', async () => {
    const user = userEvent.setup();
    const onValueInvalid = vi.fn();
    render(
      <TagsInput
        label="タグ"
        validate={({ inputValue }) => inputValue.length >= 2}
        onValueInvalid={onValueInvalid}
      />,
    );
    await user.type(screen.getByLabelText('タグ'), 'V{Enter}');
    expect(screen.queryByText('V')).not.toBeInTheDocument();
    expect(onValueInvalid).toHaveBeenCalledWith({ reason: 'invalidTag' });
  });

  it('stops adding tags once max is reached', async () => {
    const user = userEvent.setup();
    render(<TagsInput label="タグ" defaultValue={['React', 'Vue']} max={2} />);
    await user.type(screen.getByLabelText('タグ'), 'Svelte{Enter}');
    expect(screen.queryByText('Svelte')).not.toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  it('carries the comma-joined value in a hidden input for forms', () => {
    const { container } = render(
      <form>
        <TagsInput name="tags" defaultValue={['React', 'Vue']} />
      </form>,
    );
    const form = container.querySelector('form');
    if (form === null) throw new Error('form not rendered');
    expect(new FormData(form).get('tags')).toBe('React, Vue');
  });

  it('disables the input and the delete buttons when disabled', () => {
    render(<TagsInput label="タグ" defaultValue={['React']} disabled />);
    expect(screen.getByLabelText('タグ')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Reactを削除' })).toBeDisabled();
  });
});
