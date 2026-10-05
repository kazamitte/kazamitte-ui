import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormLayout } from '../../components/FormLayout';

describe('FormLayout', () => {
  it('adds no role, leaving the fields and actions as they are', () => {
    render(
      <form aria-label="会員情報">
        <FormLayout.Root>
          <FormLayout.Row>
            <input aria-label="姓" />
            <input aria-label="名" />
          </FormLayout.Row>
          <FormLayout.Actions align="between">
            <button type="submit">保存</button>
          </FormLayout.Actions>
        </FormLayout.Root>
      </form>,
    );
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '姓' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '名' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
