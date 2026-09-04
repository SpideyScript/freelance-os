import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
  const numericAmount = Number(amount);
  const value = isNaN(numericAmount) || Object.is(numericAmount, -0) ? 0 : numericAmount;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDuration(seconds) {
  const hrs = Math.floor((seconds || 0) / 3600);
  const mins = Math.floor(((seconds || 0) % 3600) / 60);
  const secs = (seconds || 0) % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  return `${mins}m ${secs}s`;
}

export function formatDurationDigital(seconds) {
  const hrs = Math.floor((seconds || 0) / 3600);
  const mins = Math.floor(((seconds || 0) % 3600) / 60);
  const secs = (seconds || 0) % 60;

  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}
