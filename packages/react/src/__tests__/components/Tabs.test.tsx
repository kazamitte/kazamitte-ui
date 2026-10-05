import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '../../components/Tabs';

const renderTabs = (props: React.ComponentProps<typeof Tabs.Root> = {}) =>
  render(
    <Tabs.Root defaultValue="overview" {...props}>
      <Tabs.List>
        <Tabs.Trigger value="overview">概要</Tabs.Trigger>
        <Tabs.Trigger value="usage">使い方</Tabs.Trigger>
        <Tabs.Trigger value="api" disabled>
          API
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">概要の本文</Tabs.Content>
      <Tabs.Content value="usage">使い方の本文</Tabs.Content>
      <Tabs.Content value="api">APIの本文</Tabs.Content>
    </Tabs.Root>,
  );

describe('Tabs', () => {
  it('exposes a tablist whose tabs control their panels', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tab = screen.getByRole('tab', { name: '概要' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'id',
      tab.getAttribute('aria-controls'),
    );
  });

  it('shows only the selected panel', async () => {
    const user = userEvent.setup();
    renderTabs();
    expect(screen.getByText('概要の本文')).toBeVisible();
    expect(screen.getByText('使い方の本文')).not.toBeVisible();

    await user.click(screen.getByRole('tab', { name: '使い方' }));
    expect(screen.getByText('使い方の本文')).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText('概要の本文')).not.toBeVisible(),
    );
  });

  it('moves focus with the arrow keys, skipping disabled tabs and looping', async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(screen.getByRole('tab', { name: '概要' }));
    await user.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(screen.getByRole('tab', { name: '使い方' })).toHaveFocus(),
    );
    await user.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(screen.getByRole('tab', { name: '概要' })).toHaveFocus(),
    );
  });

  it('waits for Enter before selecting in manual activation mode', async () => {
    const user = userEvent.setup();
    renderTabs({ activationMode: 'manual' });
    await user.click(screen.getByRole('tab', { name: '概要' }));
    await user.keyboard('{ArrowRight}');
    const usage = screen.getByRole('tab', { name: '使い方' });
    await waitFor(() => expect(usage).toHaveFocus());
    expect(usage).toHaveAttribute('aria-selected', 'false');

    await user.keyboard('{Enter}');
    expect(usage).toHaveAttribute('aria-selected', 'true');
  });

  it('forwards onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ onValueChange });
    await user.click(screen.getByRole('tab', { name: '使い方' }));
    expect(onValueChange).toHaveBeenCalledWith({ value: 'usage' });
  });

  it('follows a controlled value prop', () => {
    renderTabs({ value: 'usage' });
    expect(screen.getByRole('tab', { name: '使い方' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('使い方の本文')).toBeVisible();
  });
});
