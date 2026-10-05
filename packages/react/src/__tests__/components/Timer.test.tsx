import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Timer } from '../../components/Timer';

// Ark ticks outside the fake-timer hooks; use real time with a short interval.
describe('Timer', { timeout: 15000 }, () => {
  it('shows the remaining time as digits named in Japanese', () => {
    render(<Timer countdown startMs={90 * 1000} />);
    const area = screen.getByRole('timer');
    expect(area).toHaveAccessibleName('0時間1分30秒');
    expect(area).toHaveTextContent('00:01:30');
  });

  it('counts down once started and offers pause and reset', async () => {
    const user = userEvent.setup();
    render(<Timer countdown startMs={5 * 1000} interval={50} />);
    await user.click(screen.getByRole('button', { name: '開始' }));
    await waitFor(
      () => expect(screen.getByRole('timer')).not.toHaveTextContent('00:00:05'),
      { timeout: 8000 },
    );

    // Pause first so a running tick can't fire between reset and the assertion.
    await user.click(screen.getByRole('button', { name: '一時停止' }));
    await user.click(screen.getByRole('button', { name: 'リセット' }));
    await waitFor(() =>
      expect(screen.getByRole('timer')).toHaveTextContent('00:00:05'),
    );
  });

  it('hides the controls when asked', () => {
    render(<Timer startMs={0} controls={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
