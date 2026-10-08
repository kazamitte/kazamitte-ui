import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Tabs } from '../../components/Tabs';

const renderTabs = () =>
  render(
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">概要</Tabs.Trigger>
        <Tabs.Trigger value="usage">使い方</Tabs.Trigger>
        <Tabs.Trigger value="api">API</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">概要の本文</Tabs.Content>
      <Tabs.Content value="usage">使い方の本文</Tabs.Content>
      <Tabs.Content value="api">APIの本文</Tabs.Content>
    </Tabs.Root>,
  );

describe('Tabs', () => {
  it('moves focus, selection and the tab stop together on ArrowRight, and switches the shown panel', async () => {
    renderTabs();
    screen.getByRole('tab', { name: '概要' }).focus();
    await userEvent.keyboard('{ArrowRight}');

    const usage = screen.getByRole('tab', { name: '使い方' });
    await expect.poll(() => usage === document.activeElement).toBe(true);
    await expect.poll(() => usage.getAttribute('aria-selected')).toBe('true');
    expect(usage).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: '概要' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
    await expect
      .poll(() => screen.getByText('使い方の本文').checkVisibility())
      .toBe(true);
  });

  it('wraps ArrowLeft from the first tab to the last', async () => {
    renderTabs();
    screen.getByRole('tab', { name: '概要' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    const api = screen.getByRole('tab', { name: 'API' });
    await expect.poll(() => api === document.activeElement).toBe(true);
    await expect.poll(() => api.getAttribute('aria-selected')).toBe('true');
  });

  it('jumps the tab stop to the first and last tab with Home and End', async () => {
    renderTabs();
    screen.getByRole('tab', { name: '使い方' }).focus();
    await userEvent.keyboard('{End}');
    const api = screen.getByRole('tab', { name: 'API' });
    await expect.poll(() => api === document.activeElement).toBe(true);

    await userEvent.keyboard('{Home}');
    const overview = screen.getByRole('tab', { name: '概要' });
    await expect.poll(() => overview === document.activeElement).toBe(true);
  });
});
