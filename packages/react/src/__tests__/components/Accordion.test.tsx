import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from '../../components/Accordion';

const renderAccordion = (
  props: React.ComponentProps<typeof Accordion.Root> = {},
) =>
  render(
    <Accordion.Root {...props}>
      <Accordion.Item value="shipping">
        <Accordion.ItemTrigger>
          送料はいくらですか？
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>全国一律500円です。</Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.ItemTrigger>返品できますか？</Accordion.ItemTrigger>
        <Accordion.ItemContent>
          到着後7日以内なら可能です。
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>,
  );

describe('Accordion', () => {
  it('opens one item at a time, wiring the trigger to its region', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderAccordion({ onValueChange });
    const trigger = screen.getByRole('button', {
      name: '送料はいくらですか？',
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(onValueChange).toHaveBeenCalledWith({ value: ['shipping'] });
    const region = screen.getByRole('region', { name: '送料はいくらですか？' });
    expect(region).toHaveAttribute('id', trigger.getAttribute('aria-controls'));

    await user.click(screen.getByRole('button', { name: '返品できますか？' }));
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    );
  });

  it('keeps several items open with multiple', async () => {
    const user = userEvent.setup();
    renderAccordion({ multiple: true });
    await user.click(
      screen.getByRole('button', { name: '送料はいくらですか？' }),
    );
    await user.click(screen.getByRole('button', { name: '返品できますか？' }));
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });

  it('lets the open item close again only when collapsible', async () => {
    const user = userEvent.setup();
    renderAccordion({ defaultValue: ['shipping'] });
    const trigger = screen.getByRole('button', {
      name: '送料はいくらですか？',
    });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
