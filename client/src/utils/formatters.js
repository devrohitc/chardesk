export const TODAY = new Date().toLocaleDateString('en-CA');

export const CURRENCY = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatDate(
  value,
  options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', options);
}

export function shiftDate(value, amount) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return date.toLocaleDateString('en-CA');
}

export function slugTitle(value = '') {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
