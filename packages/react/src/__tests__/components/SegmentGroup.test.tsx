import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { SegmentGroup } from '../../components/SegmentGroup';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

const OPTIONS = [
  { value: 'list', label: 'リスト' },
  { value: 'grid', label: 'グリッド' },
  { value: 'map', label: '地図', disabled: true },
];

describe('SegmentGroup', () => {
  it('is a radio group named by the label whose radios select on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentGroup
        label="表示形式"
        options={OPTIONS}
        defaultValue="list"
        onValueChange={onValueChange}
      />,
    );
    screen.getByRole('radiogroup', { name: '表示形式' });
    expect(screen.getByRole('radio', { name: 'リスト' })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'グリッド' }));
    expect(onValueChange).toHaveBeenCalledWith({ value: 'grid' });
    expect(screen.getByRole('radio', { name: 'グリッド' })).toBeChecked();
  });

  it('disables an option flagged disabled and does not select it on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentGroup
        label="表示形式"
        options={OPTIONS}
        defaultValue="list"
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole('radio', { name: '地図' })).toBeDisabled();
    await user.click(screen.getByText('地図'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
