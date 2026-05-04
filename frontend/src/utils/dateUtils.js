export function getTodayDate() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function toDateObject(value) {
  if (!value) return '';

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : value;
  }

  const text = String(value);
  const brazilianDate = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brazilianDate) {
    const [, day, month, year] = brazilianDate;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? '' : date;
}

export function clampFutureDate(value) {
  if (!value) return '';

  const date = toDateObject(value);
  if (!date) return '';

  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = getTodayDate();

  return normalizedDate > today ? today : normalizedDate;
}

export function normalizeDate(value) {
  const date = toDateObject(value);
  if (!date) return '';

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
