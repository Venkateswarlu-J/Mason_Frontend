/* src/utils/helpers.js */

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name = '') {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function isAfterNoon() {
  return new Date().getHours() >= 12;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
