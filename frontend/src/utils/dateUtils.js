/* Utilitário para manipulação de objetos Data para normalização de formato brasileiro */

export function getTodayDate() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // novo objeto data com ano, mes e data (e tempo zerado)
}

export function toDateObject(value) {
  if (!value) return null; 

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = String(value);
  const brazilianDate = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brazilianDate) {
    const [, day, month, year] = brazilianDate;
    return new Date(Number(year), Number(month) - 1, Number(day)); // em JS, os meses começam em 0 (janeiro) e vao até 11 (dezembro), por isso o -1
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date; // se for data ok se nao, retorna string vazia
}

export function clampFutureDate(value) {
  if (!value) return null;

  const date = toDateObject(value);
  if (!date) return null;

  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = getTodayDate();

  return normalizedDate > today ? today : normalizedDate; // se a data fornecida for maior que hoje, retorna objeto da funcao getTodayDate() - linha 3
}

export function normalizeDate(value) {
  const date = toDateObject(value);
  if (!date) return null;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
