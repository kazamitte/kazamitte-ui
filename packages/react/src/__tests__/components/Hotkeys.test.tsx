import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HotkeyText, useHotkey } from '../../components/Hotkeys';

const Sample = ({ onFire }: { onFire: () => void }) => {
  useHotkey({
    hotkey: 'mod+k',
    action: onFire,
    options: { enableOnFormTags: false },
  });
  return <input aria-label="検索" />;
};

describe('Hotkeys', () => {
  it('runs the action when the combination is pressed outside a field', async () => {
    const user = userEvent.setup();
    const onFire = vi.fn();
    render(<Sample onFire={onFire} />);
    await user.keyboard('{Control>}k{/Control}');
    expect(onFire).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('textbox', { name: '検索' }));
    await user.keyboard('{Control>}k{/Control}');
    expect(onFire).toHaveBeenCalledTimes(1);
  });

  it('prints a combination as keys, with the separator hidden from readers', () => {
    render(<HotkeyText hotkey="mod+k" />);
    const keys = document.querySelectorAll('kbd');
    expect(keys).toHaveLength(2);
    expect(keys[1]).toHaveTextContent('K');
    expect(document.querySelector('[aria-hidden="true"]')).toHaveTextContent(
      '+',
    );
  });

  it('prints a sequence as separate keys joined by a readable step separator, not a combo', () => {
    render(<HotkeyText hotkey="g then n" />);
    const keys = document.querySelectorAll('kbd');
    expect(keys).toHaveLength(2);
    expect(keys[0]).toHaveTextContent('G');
    expect(keys[1]).toHaveTextContent('N');
    expect(screen.getByText('の次に')).toBeVisible();
    expect(screen.queryByText(/then/i)).not.toBeInTheDocument();
  });
});
