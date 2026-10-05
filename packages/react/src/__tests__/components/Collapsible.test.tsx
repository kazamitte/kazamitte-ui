import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible } from '../../components/Collapsible';

const renderCollapsible = (
  props: React.ComponentProps<typeof Collapsible.Root> = {},
) =>
  render(
    <Collapsible.Root {...props}>
      <Collapsible.Trigger>
        詳細
        <Collapsible.Indicator>▾</Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content>本文</Collapsible.Content>
    </Collapsible.Root>,
  );

describe('Collapsible', () => {
  it('hides the content until the trigger is pressed', async () => {
    const user = userEvent.setup();
    renderCollapsible();
    const trigger = screen.getByRole('button', { name: '詳細 ▾' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('本文')).not.toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('本文')).toBeVisible();
  });

  it('links the trigger to the content it controls', () => {
    renderCollapsible({ defaultOpen: true });
    const trigger = screen.getByRole('button');
    expect(screen.getByText('本文')).toHaveAttribute(
      'id',
      trigger.getAttribute('aria-controls'),
    );
  });

  it('forwards onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderCollapsible({ onOpenChange });
    await user.click(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith({ open: true });
  });

  it('follows a controlled open prop', () => {
    renderCollapsible({ open: true });
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('本文')).toBeVisible();
  });
});
