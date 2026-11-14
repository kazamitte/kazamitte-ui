import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Tabs } from '@kazamitte/kazamitte-ui';

it('labels the selected panel with its tab when the kit is pre-bundled', async () => {
  const user = userEvent.setup();
  render(
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">概要</Tabs.Trigger>
        <Tabs.Trigger value="usage">使い方</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">概要の本文</Tabs.Content>
      <Tabs.Content value="usage">使い方の本文</Tabs.Content>
    </Tabs.Root>,
  );
  expect(screen.getByRole('tabpanel', { name: '概要' })).toBeVisible();

  await user.click(screen.getByRole('tab', { name: '使い方' }));
  expect(screen.getByRole('tabpanel', { name: '使い方' })).toHaveTextContent(
    '使い方の本文',
  );
});
