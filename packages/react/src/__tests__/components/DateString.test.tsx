import { describe, expect, it } from 'vitest';
import {
  fromDateString,
  parseDate,
  toDateString,
} from '../../components/DatePicker';

describe('DatePicker date string helpers', () => {
  it('round-trips YYYY-MM-DD through a DateValue', () => {
    expect(toDateString(fromDateString('2026-11-07'))).toBe('2026-11-07');
    expect(toDateString(parseDate('0099-01-02'))).toBe('0099-01-02');
  });

  it('turns an empty value into an empty string', () => {
    expect(toDateString(undefined)).toBe('');
    expect(toDateString(null)).toBe('');
  });

  it('turns an empty or invalid string into undefined', () => {
    expect(fromDateString('')).toBeUndefined();
    expect(fromDateString('hello')).toBeUndefined();
    expect(fromDateString('2026-13-01')).toBeUndefined();
    expect(fromDateString('2026-02-30')).toBeUndefined();
    expect(fromDateString('2026-1-5')).toBeUndefined();
  });
});
