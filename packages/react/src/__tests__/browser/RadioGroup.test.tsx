import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Button } from '../../components/Button';
import { RadioGroup } from '../../components/RadioGroup';

const OPTIONS = [
  { value: 'email', label: 'メール' },
  { value: 'sms', label: 'SMS' },
  { value: 'call', label: '電話' },
];

const renderWithNeighbors = (defaultValue: string) =>
  render(
    <>
      <Button>前</Button>
      <RadioGroup
        label="連絡方法"
        options={OPTIONS}
        defaultValue={defaultValue}
      />
      <Button>後</Button>
    </>,
  );

describe('RadioGroup', () => {
  it('keeps a single tab stop: Tab lands only on the checked radio, skipping the rest', async () => {
    renderWithNeighbors('sms');
    await userEvent.tab();
    await expect
      .poll(
        () =>
          screen.getByRole('button', { name: '前' }) === document.activeElement,
      )
      .toBe(true);

    await userEvent.tab();
    const sms = screen.getByRole('radio', { name: 'SMS' });
    await expect.poll(() => sms === document.activeElement).toBe(true);

    await userEvent.tab();
    await expect
      .poll(
        () =>
          screen.getByRole('button', { name: '後' }) === document.activeElement,
      )
      .toBe(true);
  });

  it('moves focus and selection together with ArrowDown, wrapping past the last option', async () => {
    renderWithNeighbors('call');
    screen.getByRole('radio', { name: '電話' }).focus();
    await userEvent.keyboard('{ArrowDown}');

    const email = screen.getByRole('radio', { name: 'メール' });
    await expect.poll(() => email === document.activeElement).toBe(true);
    expect(email).toBeChecked();
    expect(screen.getByRole('radio', { name: '電話' })).not.toBeChecked();
  });

  it('moves focus and selection together with ArrowUp, wrapping before the first option', async () => {
    renderWithNeighbors('email');
    screen.getByRole('radio', { name: 'メール' }).focus();
    await userEvent.keyboard('{ArrowUp}');

    const call = screen.getByRole('radio', { name: '電話' });
    await expect.poll(() => call === document.activeElement).toBe(true);
    expect(call).toBeChecked();
    expect(screen.getByRole('radio', { name: 'メール' })).not.toBeChecked();
  });
});
