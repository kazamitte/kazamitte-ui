import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RatingGroup } from '../../components/RatingGroup';

describe('RatingGroup', () => {
  it('is a labelled radio group with one star per step, named in Japanese', () => {
    render(<RatingGroup label="評価" defaultValue={3} />);
    const group = screen.getByRole('radiogroup', { name: '評価' });
    expect(group).toBeInTheDocument();
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

  it('marks the highlighted stars, including a half star', () => {
    render(<RatingGroup label="評価" allowHalf defaultValue={2.5} readOnly />);
    const stars = screen.getAllByRole('radio');
    expect(stars[1]).toHaveAttribute('data-highlighted');
    expect(stars[2]).toHaveAttribute('data-half');
    expect(stars[3]).not.toHaveAttribute('data-highlighted');
  });
});
