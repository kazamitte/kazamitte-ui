import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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

  it('skips a disabled tab when moving with the arrow keys', async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(screen.getByRole('tab', { name: '使い方' }));
    await user.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(screen.getByRole('tab', { name: '概要' })).toHaveFocus(),
    );
  });

  it('gives only the selected tab a tab stop', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: '概要' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('tab', { name: '使い方' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });
});
