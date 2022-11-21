import { abbreviateNumber } from 'js-abbreviation-number';

/** Abbreviate number to human readable string */
export function toHumanString(data: number) {
  return abbreviateNumber(data, 1, { padding: false });
}
