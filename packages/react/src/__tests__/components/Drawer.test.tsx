import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Drawer } from '../../components/Drawer';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

// jsdom keeps Ark's pointer-events: none after unmount; skip the check.
const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

const renderDrawer = (props: React.ComponentProps<typeof Drawer.Root> = {}) =>
  render(
    <Drawer.Root {...props}>
      <Drawer.Trigger>編集</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content size="sm">
            <Drawer.Grabber>
              <Drawer.GrabberIndicator />
            </Drawer.Grabber>
            <Drawer.Header>
              <Drawer.Title>プロフィールを編集</Drawer.Title>
              <Drawer.Description>
                変更は保存まで反映されません。
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer>
              <Drawer.CloseTrigger>閉じる</Drawer.CloseTrigger>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Portal>
    </Drawer.Root>,
  );

describe('Drawer', () => {
  it('opens a modal dialog named by its title and described by its description', async () => {
    const user = setup();
    renderDrawer();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '編集' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'プロフィールを編集',
    });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription(
      '変更は保存まで反映されません。',
    );
  });

  it('closes from the close trigger, reporting the change', async () => {
    const user = setup();
    const onOpenChange = vi.fn();
    renderDrawer({ onOpenChange });
    await user.click(screen.getByRole('button', { name: '編集' }));
    await user.click(await screen.findByRole('button', { name: '閉じる' }));
    expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});
