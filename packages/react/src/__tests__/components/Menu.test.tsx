import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Menu } from '../../components/Menu';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const renderMenu = (props: React.ComponentProps<typeof Menu.Root> = {}) =>
  render(
    <Menu.Root {...props}>
      <Menu.Trigger>操作</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="edit">編集</Menu.Item>
            <Menu.Item value="duplicate" disabled>
              複製
            </Menu.Item>
            <Menu.Separator />
            <Menu.CheckboxItem value="pin" checked>
              <Menu.ItemIndicator />
              <Menu.ItemText>固定する</Menu.ItemText>
            </Menu.CheckboxItem>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>,
  );

describe('Menu', () => {
  it('opens a menu of items from the trigger and reports the selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderMenu({ onSelect });
    const trigger = screen.getByRole('button', { name: '操作' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

    await user.click(trigger);
    const menu = await screen.findByRole('menu');
    expect(menu).toBeVisible();
    expect(screen.getByRole('menuitem', { name: '複製' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    await user.click(screen.getByRole('menuitem', { name: '編集' }));
    expect(onSelect).toHaveBeenCalledWith({ value: 'edit' });
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });

  it('exposes a checkbox item with its checked state', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: '操作' }));
    expect(
      await screen.findByRole('menuitemcheckbox', { name: '固定する' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: '操作' }));
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });
});
