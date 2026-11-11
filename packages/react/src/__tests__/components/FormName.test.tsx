import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RadioGroup } from '../../components/RadioGroup';
import { SegmentGroup } from '../../components/SegmentGroup';

const OPTIONS = [
  { value: 'practice', label: '練習' },
  { value: 'timed', label: '計測' },
];

const formValue = (name: string) => {
  const form = document.querySelector('form');
  if (form === null) throw new Error('no form');
  return new FormData(form).get(name);
};

describe('name reaches native form submission', () => {
  it('RadioGroup puts the default and the picked value in FormData', async () => {
    const user = userEvent.setup();
    render(
      <form>
        <RadioGroup name="mode" defaultValue="practice" options={OPTIONS} />
      </form>,
    );
    expect(formValue('mode')).toBe('practice');
    await user.click(screen.getByRole('radio', { name: '計測' }));
    expect(formValue('mode')).toBe('timed');
  });

  it('SegmentGroup puts the default and the picked value in FormData', async () => {
    const user = userEvent.setup();
    render(
      <form>
        <SegmentGroup
          label="モード"
          name="mode"
          defaultValue="practice"
          options={OPTIONS}
        />
      </form>,
    );
    expect(formValue('mode')).toBe('practice');
    await user.click(screen.getByRole('radio', { name: '計測' }));
    expect(formValue('mode')).toBe('timed');
  });
});
