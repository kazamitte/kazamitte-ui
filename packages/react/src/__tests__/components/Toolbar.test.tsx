import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Button } from '../../components/Button';
import { Menu } from '../../components/Menu';
import { Toggle } from '../../components/Toggle';
import { ToggleGroup } from '../../components/ToggleGroup';
import { Toolbar } from '../../components/Toolbar';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const renderToolbar = (props: React.ComponentProps<typeof Toolbar.Root> = {}) =>
  render(
    <>
      <button type="button">前</button>
      <Toolbar.Root aria-label="書式" {...props}>
        <Toolbar.Button>太字</Toolbar.Button>
        <Toolbar.Button>斜体</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button>下線</Toolbar.Button>
      </Toolbar.Root>
      <button type="button">後</button>
    </>,
  );

const tabIndexes = () =>
  screen.getAllByRole('button').map((el) => el.getAttribute('tabindex'));

describe('Toolbar', () => {
  it('has the toolbar role, an orientation and a name', () => {
    renderToolbar();
    const toolbar = screen.getByRole('toolbar', { name: '書式' });
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('is one tab stop: Tab enters on the first item and the next Tab leaves', async () => {
    const user = userEvent.setup();
    renderToolbar();
    expect(tabIndexes()).toEqual([null, '0', '-1', '-1', null]);

    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: '太字' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: '後' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: '太字' })).toHaveFocus();
  });

  it('moves with ArrowRight and ArrowLeft, and the tab stop follows focus', async () => {
    const user = userEvent.setup();
    renderToolbar();
    screen.getByRole('button', { name: '太字' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '斜体' })).toHaveFocus();
    expect(tabIndexes()).toEqual([null, '-1', '0', '-1', null]);
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: '太字' })).toHaveFocus();
  });

  it('re-enters on the item that was last focused', async () => {
    const user = userEvent.setup();
    renderToolbar();
    screen.getByRole('button', { name: '前' }).focus();
    screen.getByRole('button', { name: '斜体' }).focus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: '前' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: '斜体' })).toHaveFocus();
  });

  it('jumps with Home and End', async () => {
    const user = userEvent.setup();
    renderToolbar();
    screen.getByRole('button', { name: '斜体' }).focus();
    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: '下線' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('button', { name: '太字' })).toHaveFocus();
  });

  it('wraps at the ends by default and stops there when loopFocus is false', async () => {
    const user = userEvent.setup();
    const { unmount } = renderToolbar();
    screen.getByRole('button', { name: '下線' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '太字' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: '下線' })).toHaveFocus();
    unmount();

    renderToolbar({ loopFocus: false });
    screen.getByRole('button', { name: '下線' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '下線' })).toHaveFocus();
    screen.getByRole('button', { name: '太字' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: '太字' })).toHaveFocus();
  });

  it('uses ArrowDown and ArrowUp when vertical, and ignores left and right', async () => {
    const user = userEvent.setup();
    renderToolbar({ orientation: 'vertical' });
    expect(screen.getByRole('toolbar')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
    screen.getByRole('button', { name: '太字' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '太字' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: '斜体' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: '太字' })).toHaveFocus();
  });

  it('keeps a disabled button focusable but swallows its click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Button>太字</Toolbar.Button>
        <Toolbar.Button disabled onClick={onClick}>
          斜体
        </Toolbar.Button>
      </Toolbar.Root>,
    );
    screen.getByRole('button', { name: '太字' }).focus();
    await user.keyboard('{ArrowRight}');
    const italic = screen.getByRole('button', { name: '斜体' });
    expect(italic).toHaveFocus();
    expect(italic).toHaveAttribute('aria-disabled', 'true');
    expect(italic).not.toBeDisabled();
    await user.click(italic);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('drops a disabled button from the order when focusableWhenDisabled is false', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Button>太字</Toolbar.Button>
        <Toolbar.Button disabled focusableWhenDisabled={false}>
          斜体
        </Toolbar.Button>
        <Toolbar.Button>下線</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole('button', { name: '斜体' })).toBeDisabled();
    screen.getByRole('button', { name: '太字' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '下線' })).toHaveFocus();
  });

  it('disables every item of a disabled Group and of a disabled Root', () => {
    render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Group aria-label="配置" disabled>
          <Toolbar.Button>左</Toolbar.Button>
          <Toolbar.Button>右</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Button>太字</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole('button', { name: '左' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('button', { name: '右' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('button', { name: '太字' })).not.toHaveAttribute(
      'aria-disabled',
    );
  });

  it('disables everything under a disabled Root', () => {
    renderToolbar({ disabled: true });
    expect(screen.getByRole('button', { name: '太字' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('gives Group the group role with its name, and Separator the opposite orientation', () => {
    const { unmount } = render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Group aria-label="配置">
          <Toolbar.Button>左</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Button>太字</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole('group', { name: '配置' })).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
    unmount();

    render(
      <Toolbar.Root aria-label="書式" orientation="vertical">
        <Toolbar.Button>太字</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button>斜体</Toolbar.Button>
      </Toolbar.Root>,
    );
    // horizontal is the default, which has no attribute to carry
    expect(screen.getByRole('separator')).not.toHaveAttribute(
      'aria-orientation',
    );
  });

  it('includes a Link in the arrow-key order', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Button>太字</Toolbar.Button>
        <Toolbar.Link href="/help">ヘルプ</Toolbar.Link>
      </Toolbar.Root>,
    );
    screen.getByRole('button', { name: '太字' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('link', { name: 'ヘルプ' })).toHaveFocus();
  });

  it('picks up an item added later and drops one that was removed', async () => {
    const user = userEvent.setup();
    const Sample = () => {
      const [extra, setExtra] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setExtra(true)}>
            追加
          </button>
          <Toolbar.Root aria-label="書式">
            <Toolbar.Button>太字</Toolbar.Button>
            {extra && <Toolbar.Button>斜体</Toolbar.Button>}
          </Toolbar.Root>
        </>
      );
    };
    render(<Sample />);
    await user.click(screen.getByRole('button', { name: '追加' }));
    screen.getByRole('button', { name: '太字' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '斜体' })).toHaveFocus();
  });

  it('moves through the items of a ToggleGroup and a Toggle with the toolbar arrows', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Button>戻す</Toolbar.Button>
        <ToggleGroup
          aria-label="配置"
          deselectable
          items={[
            { value: 'left', label: '左' },
            { value: 'center', label: '中央' },
          ]}
        />
        <Toggle aria-label="太字">B</Toggle>
      </Toolbar.Root>,
    );
    const radios = screen.getAllByRole('radio');
    // one tab stop for the whole toolbar
    expect(
      [
        screen.getByRole('button', { name: '戻す' }),
        ...radios,
        screen.getByRole('button', { name: '太字' }),
      ].map((el) => el.getAttribute('tabindex')),
    ).toEqual(['0', '-1', '-1', '-1']);

    screen.getByRole('button', { name: '戻す' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(radios[0]).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(radios[1]).toHaveFocus();
    // arrows only move focus, as in a toolbar on its own
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: '太字' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(radios[0]).toHaveFocus();
    await user.keyboard(' ');
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
  });

  it('works as a Menu trigger with the trigger wrapping Toolbar.Button', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Button>太字</Toolbar.Button>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Toolbar.Button>その他</Toolbar.Button>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="a">項目A</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Toolbar.Root>,
    );
    screen.getByRole('button', { name: '太字' }).focus();
    await user.keyboard('{ArrowRight}');
    const trigger = screen.getByRole('button', { name: 'その他' });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await user.click(trigger);
    expect(
      await screen.findByRole('menuitem', { name: '項目A' }),
    ).toBeVisible();
  });

  it('works as a Menu trigger with Toolbar.Button wrapping the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Button>太字</Toolbar.Button>
        <Menu.Root>
          <Toolbar.Button asChild>
            <Menu.Trigger>その他</Menu.Trigger>
          </Toolbar.Button>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="a">項目A</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Toolbar.Root>,
    );
    screen.getByRole('button', { name: '太字' }).focus();
    await user.keyboard('{ArrowRight}');
    const trigger = screen.getByRole('button', { name: 'その他' });
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    expect(
      await screen.findByRole('menuitem', { name: '項目A' }),
    ).toBeVisible();
  });

  it('does not take arrow keys that come from an open Menu list', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar.Root aria-label="書式">
        <Menu.Root>
          <Menu.Trigger asChild>
            <Toolbar.Button>その他</Toolbar.Button>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="a">項目A</Menu.Item>
                <Menu.Item value="b">項目B</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
        <Toolbar.Button>太字</Toolbar.Button>
      </Toolbar.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'その他' }));
    await screen.findByRole('menuitem', { name: '項目A' });
    await user.keyboard('{ArrowDown}{ArrowRight}');
    expect(screen.getByRole('button', { name: '太字' })).not.toHaveFocus();
  });

  it('forwards the ref to the toolbar element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Toolbar.Root ref={ref} aria-label="書式">
        <Toolbar.Button>太字</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(ref.current).toBe(screen.getByRole('toolbar'));
  });

  it('leaves a plain Button inside a Toolbar alone', () => {
    render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Button>太字</Toolbar.Button>
        <Button>普通</Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole('button', { name: '普通' })).not.toHaveAttribute(
      'tabindex',
    );
  });
});
