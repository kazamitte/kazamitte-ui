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

  it('hides the default check indicator from assistive technology', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: '操作' }));
    const item = await screen.findByRole('menuitemcheckbox', {
      name: '固定する',
    });
    expect(item.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes radio items with the selected one checked and reports a change', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Menu.Root>
        <Menu.Trigger>並び順</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.RadioItemGroup value="new" onValueChange={onValueChange}>
                <Menu.RadioItem value="new">新しい順</Menu.RadioItem>
                <Menu.RadioItem value="old">古い順</Menu.RadioItem>
              </Menu.RadioItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );
    await user.click(screen.getByRole('button', { name: '並び順' }));
    expect(
      await screen.findByRole('menuitemradio', { name: '新しい順' }),
    ).toHaveAttribute('aria-checked', 'true');
    const old = screen.getByRole('menuitemradio', { name: '古い順' });
    expect(old).toHaveAttribute('aria-checked', 'false');

    await user.click(old);
    expect(onValueChange).toHaveBeenCalledWith({ value: 'old' });
  });

  it('opens a submenu from a trigger item that announces the popup', async () => {
    const user = userEvent.setup();
    render(
      <Menu.Root>
        <Menu.Trigger>操作</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Root>
                <Menu.TriggerItem>共有</Menu.TriggerItem>
                <Menu.Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="link">リンクをコピー</Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );
    await user.click(screen.getByRole('button', { name: '操作' }));
    const triggerItem = await screen.findByRole('menuitem', { name: '共有' });
    expect(triggerItem).toHaveAttribute('aria-haspopup', 'menu');
    expect(triggerItem).toHaveAttribute('aria-expanded', 'false');

    await user.click(triggerItem);
    expect(
      await screen.findByRole('menuitem', { name: 'リンクをコピー' }),
    ).toBeInTheDocument();
    expect(triggerItem).toHaveAttribute('aria-expanded', 'true');
  });
});
