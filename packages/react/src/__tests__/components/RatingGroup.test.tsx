import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RatingGroup } from '../../components/RatingGroup';

describe('RatingGroup', () => {
  it('is a labelled radio group with one star per step, named in Japanese', () => {
    render(<RatingGroup label="評価" defaultValue={3} />);
    screen.getByRole('radiogroup', { name: '評価' });
    const stars = screen.getAllByRole('radio');
    expect(stars).toHaveLength(5);
    expect(screen.getByRole('radio', { name: '3つ星' })).toBeChecked();
  });

  it('changes the value with a click and reports it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RatingGroup label="評価" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('radio', { name: '4つ星' }));
    expect(onValueChange).toHaveBeenLastCalledWith({ value: 4 });
    expect(screen.getByRole('radio', { name: '4つ星' })).toBeChecked();
  });

  it('checks the rounded-up star for a half value when allowHalf is on', () => {
    render(<RatingGroup label="評価" allowHalf defaultValue={2.5} />);
    expect(screen.getByRole('radio', { name: '3つ星' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '2つ星' })).not.toBeChecked();
  });

  it('renders as many stars as count', () => {
    render(<RatingGroup label="評価" count={3} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('moves the value with the arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RatingGroup
        label="評価"
        defaultValue={2}
        onValueChange={onValueChange}
      />,
    );
    screen.getByRole('radio', { name: '2つ星' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith({ value: 3 });
  });

  it('ignores clicks when read-only', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RatingGroup
        label="評価"
        defaultValue={2}
        readOnly
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('radio', { name: '5つ星' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('overrides the star label through translations', () => {
    render(
      <RatingGroup
        label="評価"
        defaultValue={1}
        translations={{ ratingValueText: (i) => `${i} stars` }}
      />,
    );
    expect(screen.getByRole('radio', { name: '1 stars' })).toBeChecked();
  });
});
