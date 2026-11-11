import { parseDate, type DateValue } from '@ark-ui/react/date-picker';

const DATE_STRING = /^\d{4}-\d{2}-\d{2}$/;

const pad = (n: number, width: number): string =>
  String(n).padStart(width, '0');

// Built from the fields so a DateTime or Zoned value still yields a date only.
export const toDateString = (value: DateValue | undefined | null): string =>
  value === undefined || value === null
    ? ''
    : `${pad(value.year, 4)}-${pad(value.month, 2)}-${pad(value.day, 2)}`;

export const fromDateString = (s: string): DateValue | undefined => {
  if (!DATE_STRING.test(s)) return undefined;
  try {
    const date = parseDate(s);
    // parseDate clamps 2026-02-30 instead of throwing; reject by round trip.
    return toDateString(date) === s ? date : undefined;
  } catch {
    return undefined;
  }
};
