import { format } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

// IST timezone identifier
export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Convert UTC date to IST
 */
export const toIST = (date: Date | string): Date => {
  const utcDate = typeof date === 'string' ? new Date(date) : date;
  return toZonedTime(utcDate, IST_TIMEZONE);
};

/**
 * Convert IST date back to UTC
 */
export const fromIST = (date: Date): Date => {
  return fromZonedTime(date, IST_TIMEZONE);
};

/**
 * Format date in IST timezone with Indian date format
 */
export const formatIST = (date: Date | string, formatStr: string = 'dd/MM/yyyy, hh:mm:ss a'): string => {
  const istDate = toIST(date);
  return format(istDate, formatStr);
};

/**
 * Format date for Google Sheets in IST
 */
export const formatISTForSheets = (date: Date | string): string => {
  return formatIST(date, 'dd/MM/yyyy HH:mm:ss');
};

/**
 * Get current IST timestamp
 */
export const getCurrentIST = (): Date => {
  return toIST(new Date());
};

/**
 * Format timestamp for display in IST
 */
export const formatTimestampIST = (timestamp: string | Date): string => {
  return formatIST(timestamp, 'dd MMM yyyy, hh:mm a');
};