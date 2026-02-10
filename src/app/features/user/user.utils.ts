import { yearsFromToday } from '../../common/utils/date.utils';

export function isUnderAge(birthdate: string, limitAge: number): boolean {
  const years = yearsFromToday(birthdate);

  if (years === null) {
    return false;
  }

  return Math.floor(years) < limitAge;
}
