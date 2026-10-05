import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Combobox } from '../../components/Combobox';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const ITEMS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

describe('Combobox', () => {
  it('renders a labelled text combobox', () => {
    render(<Combobox label="フレームワーク" items={ITEMS} />);
    const input = screen.getByRole('combobox', { name: 'フレームワーク' });
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('placeholder', '入力して検索');
  });

  it('filters the options as the user types and selects with a click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="フレームワーク"
        items={ITEMS}
        onValueChange={onValueChange}
      />,
    );
    await user.type(
      screen.getByRole('combobox', { name: 'フレームワーク' }),
      'v',
    );
    await screen.findByRole('listbox');
    expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Svelte' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'React' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Vue' }));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: ['vue'] }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('combobox', { name: 'フレームワーク' }),
      ).toHaveValue('Vue'),
    );
  });

  it('shows the empty text when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Combobox label="フレームワーク" items={ITEMS} />);
    await user.type(
      screen.getByRole('combobox', { name: 'フレームワーク' }),
      'zzz',
    );
    expect(
      await screen.findByText('該当する項目がありません'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('keeps several choices as removable chips when multiple', async () => {
    const user = userEvent.setup();
    render(<Combobox label="フレームワーク" items={ITEMS} multiple />);
    const input = screen.getByRole('combobox', { name: 'フレームワーク' });
    await user.type(input, 'v');
    await user.click(await screen.findByRole('option', { name: 'Vue' }));
    await user.type(input, 's');
    await user.click(await screen.findByRole('option', { name: 'Svelte' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: 'Svelteを削除' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Vueを削除' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(
      screen.queryByRole('button', { name: 'Vueを削除' }),
    ).not.toBeInTheDocument();
  });

  it('offers to create the typed text and reports the new label', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="タグ"
        items={ITEMS}
        creatable
        onCreate={onCreate}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'タグ' });
    await user.type(input, 'Qwik');
    await user.click(
      await screen.findByRole('option', { name: '「Qwik」を追加' }),
    );
    expect(onCreate).toHaveBeenCalledWith('Qwik');
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: ['Qwik'] }),
    );
    await waitFor(() => expect(input).toHaveValue('Qwik'));
  });

  it('reports the created item in details.items with the typed value, not the placeholder', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="タグ"
        items={ITEMS}
        creatable
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'タグ' });
    await user.type(input, 'Beta');
    await user.click(
      await screen.findByRole('option', { name: '「Beta」を追加' }),
    );
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: ['Beta'],
        items: [{ value: 'Beta', label: 'Beta' }],
      }),
    );
  });

  it('lists ungrouped items without an empty group heading when mixed with grouped ones', async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        label="フレームワーク"
        items={[
          { value: 'react', label: 'React', group: 'フロント' },
          { value: 'node', label: 'Node' },
        ]}
      />,
    );
    await user.type(
      screen.getByRole('combobox', { name: 'フレームワーク' }),
      'e',
    );
    expect(
      await screen.findByRole('group', { name: 'フロント' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Node' })).toBeInTheDocument();
    expect(screen.queryAllByRole('group')).toHaveLength(1);
  });

  describe('chip removal focus (multiple)', () => {
    const setupMultiple = async () => {
      const user = userEvent.setup();
      render(<Combobox label="フレームワーク" items={ITEMS} multiple />);
      const input = screen.getByRole('combobox', { name: 'フレームワーク' });
      for (const label of ['React', 'Vue', 'Svelte']) {
        await user.type(input, label[0] ?? '');
        await user.click(await screen.findByRole('option', { name: label }));
      }
      return { user, input };
    };

    it('moves focus to the next chip when removing a middle chip', async () => {
      const { user } = await setupMultiple();
      await user.click(screen.getByRole('button', { name: 'Vueを削除' }));
      expect(
        screen.getByRole('button', { name: 'Svelteを削除' }),
      ).toHaveFocus();
    });

    it('moves focus to the previous chip when removing the last chip', async () => {
      const { user } = await setupMultiple();
      await user.click(screen.getByRole('button', { name: 'Svelteを削除' }));
      expect(screen.getByRole('button', { name: 'Vueを削除' })).toHaveFocus();
    });

    it('moves focus back to the input when removing the only chip', async () => {
      const user = userEvent.setup();
      render(<Combobox label="フレームワーク" items={ITEMS} multiple />);
      const input = screen.getByRole('combobox', { name: 'フレームワーク' });
      await user.type(input, 'v');
      await user.click(await screen.findByRole('option', { name: 'Vue' }));
      await user.click(screen.getByRole('button', { name: 'Vueを削除' }));
      expect(input).toHaveFocus();
    });
  });

  it('shows the loading text instead of the empty text while items load', async () => {
    const user = userEvent.setup();
    render(<Combobox label="都市" items={ITEMS} loading />);
    await user.type(screen.getByRole('combobox', { name: '都市' }), 'to');
    await screen.findAllByText('読み込み中');
    expect(document.querySelector('output')).toHaveTextContent('読み込み中');
    expect(
      screen.queryByText('該当する項目がありません'),
    ).not.toBeInTheDocument();
  });
});
