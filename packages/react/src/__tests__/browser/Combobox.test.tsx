import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Combobox } from '../../components/Combobox';

const ITEMS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

describe('Combobox', () => {
  it('filters the option list as each character is typed for real', async () => {
    render(<Combobox label="フレームワーク" items={ITEMS} />);
    const input = screen.getByRole('combobox', { name: 'フレームワーク' });
    await userEvent.click(input);
    await userEvent.type(input, 'v');
    const listbox = await screen.findByRole('listbox');
    await expect.poll(() => listbox).toBeVisible();
    expect(
      await screen.findByRole('option', { name: 'Vue' }),
    ).toBeInTheDocument();
    await expect
      .poll(() => screen.queryByRole('option', { name: 'React' }))
      .not.toBeInTheDocument();
  });

  it('selects the active option with ArrowDown then Enter', async () => {
    render(<Combobox label="フレームワーク" items={ITEMS} />);
    const input = screen.getByRole('combobox', { name: 'フレームワーク' });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(input).toHaveValue('Vue');
  });

  it('closes the listbox on Escape', async () => {
    render(<Combobox label="フレームワーク" items={ITEMS} />);
    const input = screen.getByRole('combobox', { name: 'フレームワーク' });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('{Escape}');
    await expect
      .poll(() => screen.queryByRole('listbox'))
      .not.toBeInTheDocument();
  });

  describe('chip removal focus (multiple)', () => {
    const selectThree = async () => {
      render(<Combobox label="フレームワーク" items={ITEMS} multiple />);
      const input = screen.getByRole('combobox', { name: 'フレームワーク' });
      for (const label of ['React', 'Vue', 'Svelte']) {
        await userEvent.click(input);
        await userEvent.type(input, label[0] ?? '');
        await userEvent.click(
          await screen.findByRole('option', { name: label }),
        );
      }
      return input;
    };

    it('moves real focus to the next chip when removing a middle chip by keyboard', async () => {
      await selectThree();
      const removeVue = screen.getByRole('button', { name: 'Vueを削除' });
      removeVue.focus();
      expect(removeVue).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      expect(
        screen.getByRole('button', { name: 'Svelteを削除' }),
      ).toHaveFocus();
    });

    it('moves real focus to the previous chip when there is no next chip', async () => {
      await selectThree();
      const removeSvelte = screen.getByRole('button', { name: 'Svelteを削除' });
      removeSvelte.focus();
      expect(removeSvelte).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      expect(screen.getByRole('button', { name: 'Vueを削除' })).toHaveFocus();
    });

    it('moves real focus to the input when removing the only remaining chip', async () => {
      const input = await selectThree();
      await userEvent.click(
        screen.getByRole('button', { name: 'Reactを削除' }),
      );
      await userEvent.click(
        screen.getByRole('button', { name: 'Svelteを削除' }),
      );
      const removeVue = screen.getByRole('button', { name: 'Vueを削除' });
      removeVue.focus();
      expect(removeVue).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      expect(input).toHaveFocus();
    });
  });
});
