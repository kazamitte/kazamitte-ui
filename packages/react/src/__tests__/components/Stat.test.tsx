import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stat } from '../../components/Stat';

const renderStat = (trend: 'up' | 'down') =>
  render(
    <Stat.Root>
      <Stat.Label>月間訪問者</Stat.Label>
      <Stat.ValueText>12,340</Stat.ValueText>
      <Stat.HelpText>
        <Stat.Indicator trend={trend}>8%</Stat.Indicator> 先月比
      </Stat.HelpText>
    </Stat.Root>,
  );

describe('Stat', () => {
  it('pairs the label and value in a description list', () => {
    renderStat('up');
    expect(screen.getByRole('term')).toHaveTextContent('月間訪問者');
    expect(screen.getAllByRole('definition')[0]).toHaveTextContent('12,340');
  });

  it('says an upward trend in words, not only by icon', () => {
    renderStat('up');
    expect(screen.getByText('8%')).toHaveTextContent('増加8%');
  });

  it('says a downward trend in words, not only by icon', () => {
    renderStat('down');
    expect(screen.getByText('8%')).toHaveTextContent('減少8%');
  });
});
