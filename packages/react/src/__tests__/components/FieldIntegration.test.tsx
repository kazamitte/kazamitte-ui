import type { ReactElement } from 'react';
import { LocaleProvider } from '@ark-ui/react/locale';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ColorPicker } from '../../components/ColorPicker';
import { Combobox } from '../../components/Combobox';
import { DateInput } from '../../components/DateInput';
import { DatePicker } from '../../components/DatePicker';
import { Editable } from '../../components/Editable';
import { Field } from '../../components/Field';
import { NumberInput } from '../../components/NumberInput';
import { PasswordInput } from '../../components/PasswordInput';
import { Select } from '../../components/Select';
import { TagsInput } from '../../components/TagsInput';

const ITEMS = [{ value: 'a', label: 'A' }];
const HELPER = '半角で入力してください';
const ERROR = '形式が正しくありません';

type Case = {
  name: string;
  // Renders the control with `ref` attached to the element that takes focus.
  control: (ref: (el: HTMLElement | null) => void) => ReactElement;
};

// WCAG 3.3.1 / 1.3.1 / 4.1.2: the focusable control inside an invalid Field
// reports the invalid state and is described by the field's text.
const cases: Case[] = [
  {
    name: 'Select',
    control: (ref) => <Select items={ITEMS} triggerRef={ref} />,
  },
  {
    name: 'Combobox',
    control: (ref) => <Combobox items={ITEMS} inputRef={ref} />,
  },
  { name: 'TagsInput', control: (ref) => <TagsInput inputRef={ref} /> },
  { name: 'NumberInput', control: (ref) => <NumberInput inputRef={ref} /> },
  { name: 'PasswordInput', control: (ref) => <PasswordInput inputRef={ref} /> },
  {
    name: 'Editable',
    control: (ref) => <Editable defaultValue="x" inputRef={ref} />,
  },
  { name: 'ColorPicker', control: (ref) => <ColorPicker inputRef={ref} /> },
  { name: 'DatePicker', control: (ref) => <DatePicker inputRef={ref} /> },
  { name: 'DateInput', control: (ref) => <DateInput inputRef={ref} /> },
];

describe('Field integration', () => {
  it.each(cases)(
    '$name is invalid and described inside an invalid Field',
    ({ control }) => {
      let target: HTMLElement | null = null;
      const ref = (el: HTMLElement | null) => {
        target = el;
      };
      render(
        <LocaleProvider locale="ja-JP">
          <Field.Root invalid>
            <Field.Label>項目</Field.Label>
            {control(ref)}
            <Field.HelperText>{HELPER}</Field.HelperText>
            <Field.ErrorText>{ERROR}</Field.ErrorText>
          </Field.Root>
        </LocaleProvider>,
      );
      expect(target).not.toBeNull();
      expect(target).toHaveAttribute('aria-invalid', 'true');
      expect(target).toHaveAccessibleDescription(`${ERROR} ${HELPER}`);
    },
  );

  it('DateInput puts the state on every date segment', () => {
    const { container } = render(
      <LocaleProvider locale="ja-JP">
        <Field.Root invalid>
          <DateInput />
          <Field.ErrorText>{ERROR}</Field.ErrorText>
        </Field.Root>
      </LocaleProvider>,
    );
    const segments = container.querySelectorAll('[role="spinbutton"]');
    expect(segments).toHaveLength(3);
    for (const segment of segments) {
      expect(segment).toHaveAttribute('aria-invalid', 'true');
      expect(segment).toHaveAccessibleDescription(ERROR);
    }
  });

  it('shows the invalid styling hook on the control', () => {
    const { container } = render(
      <LocaleProvider locale="ja-JP">
        <Field.Root invalid>
          <DateInput />
          <DatePicker />
          <ColorPicker />
        </Field.Root>
      </LocaleProvider>,
    );
    expect(
      container.querySelector('[data-part="segment-group"]'),
    ).toHaveAttribute('data-invalid');
    expect(container.querySelector('[data-part="input"]')).toHaveAttribute(
      'data-invalid',
    );
    expect(
      container.querySelector('[data-part="channel-input"]'),
    ).toHaveAttribute('data-invalid');
  });
});
