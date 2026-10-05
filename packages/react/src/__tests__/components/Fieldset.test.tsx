import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field } from '../../components/Field';
import { Fieldset } from '../../components/Fieldset';

const renderFieldset = (
  props: React.ComponentProps<typeof Fieldset.Root> = {},
) =>
  render(
    <Fieldset.Root {...props}>
      <Fieldset.Legend>配送先</Fieldset.Legend>
      <Fieldset.HelperText>荷物を届ける住所です</Fieldset.HelperText>
      <Field.Root>
        <Field.Label>郵便番号</Field.Label>
        <Field.Input />
      </Field.Root>
      <Fieldset.ErrorText>入力に誤りがあります</Fieldset.ErrorText>
    </Fieldset.Root>,
  );

describe('Fieldset', () => {
  it('groups the fields under the legend as its name', () => {
    renderFieldset();
    const group = screen.getByRole('group', { name: '配送先' });
    expect(group.tagName).toBe('FIELDSET');
    expect(group).toHaveAccessibleDescription('荷物を届ける住所です');
  });

  it('keeps the error text out of the DOM while valid', () => {
    renderFieldset();
    expect(screen.queryByText('入力に誤りがあります')).not.toBeInTheDocument();
  });

  it('shows the error text while invalid and describes the group with it', () => {
    renderFieldset({ invalid: true });
    expect(screen.getByText('入力に誤りがあります')).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: '配送先' }),
    ).toHaveAccessibleDescription(/入力に誤りがあります/);
  });

  it('disables every field inside when disabled', () => {
    renderFieldset({ disabled: true });
    expect(screen.getByRole('group', { name: '配送先' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: '郵便番号' })).toBeDisabled();
  });
});
