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

  it('offers to create the typed text and reports the new label and item', async () => {
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
      expect.objectContaining({
        value: ['Qwik'],
        items: [{ value: 'Qwik', label: 'Qwik' }],
      }),
    );
    await waitFor(() => expect(input).toHaveValue('Qwik'));
  });

  it('does not offer to create a label that matches an existing item, ignoring case', async () => {
    const user = userEvent.setup();
    render(<Combobox label="タグ" items={ITEMS} creatable />);
    await user.type(screen.getByRole('combobox', { name: 'タグ' }), 'react');
    expect(
      await screen.findByRole('option', { name: 'React' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /を追加/ }),
    ).not.toBeInTheDocument();
  });

  it('does not offer to create an option the user already created', async () => {
    const user = userEvent.setup();
    render(<Combobox label="タグ" items={ITEMS} creatable />);
    const input = screen.getByRole('combobox', { name: 'タグ' });
    await user.type(input, 'Qwik');
    await user.click(
      await screen.findByRole('option', { name: '「Qwik」を追加' }),
    );
    await user.clear(input);
    await user.type(input, 'qwik');
    expect(
      await screen.findByRole('option', { name: 'Qwik' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: '「qwik」を追加' }),
    ).not.toBeInTheDocument();
  });

  it('keeps a created option when the items change', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Combobox label="タグ" items={ITEMS} creatable multiple />,
    );
    const input = screen.getByRole('combobox', { name: 'タグ' });
    await user.type(input, 'Qwik');
    await user.click(
      await screen.findByRole('option', { name: '「Qwik」を追加' }),
    );
    rerender(
      <Combobox label="タグ" items={ITEMS.slice(0, 2)} creatable multiple />,
    );
    expect(
      await screen.findByRole('button', { name: /Qwik/ }),
    ).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, 'Q');
    expect(
      await screen.findByRole('option', { name: 'Qwik' }),
    ).toBeInTheDocument();
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
    expect(screen.getByRole('status')).toHaveTextContent('読み込み中');
    expect(
      screen.queryByText('該当する項目がありません'),
    ).not.toBeInTheDocument();
  });

  it('uses the placeholder, empty text, loading text and create text props', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Combobox
        label="タグ"
        items={ITEMS}
        creatable
        placeholder="探す"
        createText={(text) => `Add ${text}`}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'タグ' });
    expect(input).toHaveAttribute('placeholder', '探す');
    await user.type(input, 'Qwik');
    expect(
      await screen.findByRole('option', { name: 'Add Qwik' }),
    ).toBeInTheDocument();

    rerender(
      <Combobox
        label="タグ"
        items={ITEMS}
        emptyText="なし"
        loading
        loadingText="待機中"
      />,
    );
    await user.clear(input);
    await user.type(input, 'zzz');
    expect((await screen.findAllByText('待機中')).length).toBeGreaterThan(0);

    rerender(<Combobox label="タグ" items={ITEMS} emptyText="なし" />);
    expect(await screen.findByText('なし')).toBeInTheDocument();
  });

  it('shows the label of a controlled value', async () => {
    render(<Combobox label="タグ" items={ITEMS} value={['vue']} />);
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'タグ' })).toHaveValue('Vue'),
    );
  });

  it('offers the new options when the items prop changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Combobox label="タグ" items={ITEMS} />);
    rerender(
      <Combobox label="タグ" items={[{ value: 'solid', label: 'Solid' }]} />,
    );
    await user.type(screen.getByRole('combobox', { name: 'タグ' }), 'S');
    expect(
      await screen.findByRole('option', { name: 'Solid' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Svelte' }),
    ).not.toBeInTheDocument();
  });
});
