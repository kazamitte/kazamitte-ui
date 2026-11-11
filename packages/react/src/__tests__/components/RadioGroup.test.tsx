import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookOpen, Timer } from 'lucide-react';
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

  describe('with description, meta and icon', () => {
    const CARDS = [
      {
        value: 'practice',
        label: '練習',
        description: '時間を測らずに解く',
        meta: '20問',
        icon: BookOpen,
      },
      {
        value: 'timed',
        label: '計測',
        description: '制限時間つきで解く',
        icon: Timer,
      },
    ];

    it('names the radio by its label and describes it with description and meta', () => {
      render(<RadioGroup label="モード" options={CARDS} variant="card" />);
      const radio = screen.getByRole('radio', { name: '練習' });
      expect(radio).toHaveAccessibleDescription('時間を測らずに解く 20問');
      expect(
        screen.getByRole('radio', {
          name: '計測',
          description: '制限時間つきで解く',
        }),
      ).toBeInTheDocument();
    });

    it('leaves aria-describedby off when there is no description', () => {
      render(<RadioGroup options={OPTIONS} variant="card" />);
      const radio = screen.getByRole('radio', { name: 'メール' });
      expect(radio).not.toHaveAttribute('aria-describedby');
    });

    it('selects an option when its card text is clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <RadioGroup
          options={CARDS}
          variant="card"
          onValueChange={onValueChange}
        />,
      );
      await user.click(screen.getByText('制限時間つきで解く'));
      expect(onValueChange).toHaveBeenCalledWith({ value: 'timed' });
      expect(screen.getByRole('radio', { name: '計測' })).toBeChecked();
    });

    it('moves the selection with the arrow keys', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup options={CARDS} variant="card" defaultValue="practice" />,
      );
      screen.getByRole('radio', { name: '練習' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: '計測' })).toBeChecked();
    });

    it('disables the whole group in the card variant', () => {
      render(<RadioGroup options={CARDS} variant="card" disabled />);
      expect(screen.getByRole('radio', { name: '練習' })).toBeDisabled();
      expect(screen.getByRole('radio', { name: '計測' })).toBeDisabled();
    });

    it('hides the icon from assistive technology', () => {
      const { container } = render(
        <RadioGroup options={CARDS} variant="card" />,
      );
      const icons = container.querySelectorAll('svg');
      expect(icons).toHaveLength(2);
      icons.forEach((icon) =>
        expect(icon).toHaveAttribute('aria-hidden', 'true'),
      );
    });
  });
});
