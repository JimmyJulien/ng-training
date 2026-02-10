export function isValidDate(date: unknown): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function stringToDate(stringDate: string): Date | null {
  const date = new Date(stringDate);

  if (isValidDate(date)) {
    return date;
  }

  return null;
}

export function msInYears(ms: number): number {
  return ms / (1000 * 60 * 60 * 24 * 365.25);
}

export function yearsFromToday(date: string): number | null {
  const dateToCompare = stringToDate(date);

  if (dateToCompare === null) {
    return null;
  }

  const timeFromTodayInMs = new Date().getTime() - dateToCompare.getTime();

  const timeFromTodayInYears = msInYears(timeFromTodayInMs);

  return Math.floor(timeFromTodayInYears);
}
