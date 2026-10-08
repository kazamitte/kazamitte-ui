import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Accordion } from '../../components/Accordion';

const renderAccordion = () =>
  render(
    <Accordion.Root collapsible>
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
  it('toggles the trigger open and closed with Enter, keeping focus on the trigger', async () => {
    renderAccordion();
    const trigger = screen.getByRole('button', {
      name: '送料はいくらですか？',
    });
    await userEvent.tab();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('toggles the trigger open and closed with Space, keeping focus on the trigger', async () => {
    renderAccordion();
    const trigger = screen.getByRole('button', {
      name: '送料はいくらですか？',
    });
    await userEvent.tab();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.keyboard('[Space]');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveFocus();

    await userEvent.keyboard('[Space]');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });
});
