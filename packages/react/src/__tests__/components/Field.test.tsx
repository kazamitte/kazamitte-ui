import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field } from '../../components/Field';

describe('Field', () => {
  it('composes label, input and helper parts', () => {
    render(
      <Field.Root>
        <Field.Label>メール</Field.Label>
        <Field.Input placeholder="you@example.com" />
        <Field.HelperText>連絡先を入力</Field.HelperText>
      </Field.Root>,
    );
    expect(screen.getByText('メール')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'you@example.com',
    );
    expect(screen.getByText('連絡先を入力')).toBeInTheDocument();
  });

  it('renders a textarea element via Field.Textarea', () => {
    render(
      <Field.Root>
        <Field.Textarea placeholder="本文" />
      </Field.Root>,
    );
    expect(screen.getByPlaceholderText('本文').tagName).toBe('TEXTAREA');
  });

  it('renders a native select via Field.Select that the label names', () => {
    render(
      <Field.Root>
        <Field.Label>都道府県</Field.Label>
        <Field.Select>
          <option value="tokyo">東京都</option>
        </Field.Select>
      </Field.Root>,
    );
    expect(screen.getByRole('combobox', { name: '都道府県' }).tagName).toBe(
      'SELECT',
    );
  });

  it('propagates invalid and disabled from Root to the control', async () => {
    render(
      <Field.Root invalid disabled>
        <Field.Label>メール</Field.Label>
        <Field.Input />
        <Field.ErrorText>形式が違います</Field.ErrorText>
      </Field.Root>,
    );
    const input = screen.getByRole('textbox', { name: 'メール' });
    expect(input).toBeInvalid();
    expect(input).toBeDisabled();
    await waitFor(() =>
      expect(input).toHaveAttribute(
        'aria-errormessage',
        screen.getByText('形式が違います').id,
      ),
    );
  });
});
