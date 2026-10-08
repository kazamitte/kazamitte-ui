import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from '../../components/RadioGroup';

const OPTIONS = [
  { value: 'email', label: 'メール' },
  { value: 'sms', label: 'SMS' },
];

describe('RadioGroup', () => {
  it('renders one radio per option with its label', () => {
    render(<RadioGroup label="連絡方法" options={OPTIONS} />);
    const group = screen.getByRole('radiogroup', { name: '連絡方法' });
    expect(
      within(group).getByRole('radio', { name: 'メール' }),
    ).toBeInTheDocument();
    expect(
      within(group).getByRole('radio', { name: 'SMS' }),
    ).toBeInTheDocument();
  });

  it('forwards onValueChange with the selected value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RadioGroup options={OPTIONS} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('radio', { name: 'SMS' }));
    expect(onValueChange).toHaveBeenCalledWith({ value: 'sms' });
  });

  it('checks the radio matching defaultValue', () => {
    render(<RadioGroup options={OPTIONS} defaultValue="sms" />);
    expect(screen.getByRole('radio', { name: 'SMS' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'メール' })).not.toBeChecked();
  });

  it('checks the radio matching a controlled value and reports a click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        options={OPTIONS}
        value="email"
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole('radio', { name: 'メール' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'SMS' }));
    expect(onValueChange).toHaveBeenCalledWith({ value: 'sms' });
  });

  it('puts name on the radios so a form submits the choice', () => {
    render(<RadioGroup options={OPTIONS} name="contact" defaultValue="sms" />);
    expect(screen.getByRole('radio', { name: 'SMS' })).toHaveAttribute(
      'name',
      'contact',
    );
  });

  it('forwards a per-option disabled flag', () => {
    render(
      <RadioGroup options={[{ value: 'fax', label: 'FAX', disabled: true }]} />,
    );
    expect(screen.getByRole('radio', { name: 'FAX' })).toBeDisabled();
  });
});
