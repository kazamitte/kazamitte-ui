import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Slider } from '../../components/Slider';
import { stubObservers } from '../setup/observers';

beforeAll(stubObservers);

describe('Slider', () => {
  it('renders a slider named by the label with its value and bounds', () => {
    render(<Slider label="音量" defaultValue={[40]} min={0} max={80} />);
    const thumb = screen.getByRole('slider', { name: '音量' });
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '80');
    expect(thumb).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('steps with the arrow keys and jumps with Home / End, reporting each value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider
        label="音量"
        defaultValue={[40]}
        step={5}
        onValueChange={onValueChange}
      />,
    );
    const thumb = screen.getByRole('slider', { name: '音量' });
    await user.tab();
    expect(thumb).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '45');
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: [45] }),
    );
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '35');
    await user.keyboard('{End}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
    await user.keyboard('{Home}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders one thumb per value for a range', () => {
    render(<Slider label="価格" defaultValue={[20, 60]} />);
    const thumbs = screen.getAllByRole('slider', { name: '価格' });
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20');
    expect(thumbs[1]).toHaveAttribute('aria-valuenow', '60');
    expect(thumbs[0]).toHaveAttribute('aria-valuemax', '60');
  });

  it('shows the value text through formatValue', () => {
    render(
      <Slider
        label="音量"
        defaultValue={[40]}
        showValueText
        formatValue={([v]) => `${v}%`}
      />,
    );
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('joins a range as "min – max" in the value text by default', () => {
    render(<Slider label="価格" defaultValue={[20, 60]} showValueText />);
    expect(screen.getByText('20 – 60')).toBeInTheDocument();
  });

  it('starts with one thumb at min when no value is given', () => {
    render(<Slider label="音量" min={10} max={50} />);
    const thumbs = screen.getAllByRole('slider', { name: '音量' });
    expect(thumbs).toHaveLength(1);
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '10');
  });

  it('renders the marker labels', () => {
    render(<Slider label="音量" markers={[0, 50, 100]} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('tells assistive tech when it is vertical', () => {
    render(<Slider label="音量" orientation="vertical" defaultValue={[40]} />);
    expect(screen.getByRole('slider', { name: '音量' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('cannot be moved or focused when disabled', async () => {
    const user = userEvent.setup();
    render(<Slider label="音量" defaultValue={[40]} disabled />);
    const thumb = screen.getByRole('slider', { name: '音量' });
    expect(thumb).toHaveAttribute('aria-disabled', 'true');
    await user.tab();
    expect(thumb).not.toHaveFocus();
  });

  it('carries the values in hidden inputs for forms', () => {
    const { container } = render(
      <form>
        <Slider name="price" defaultValue={[20, 60]} />
      </form>,
    );
    const form = container.querySelector('form');
    if (form === null) throw new Error('form not rendered');
    expect(new FormData(form).getAll('price[]')).toEqual(['20', '60']);
  });
});
