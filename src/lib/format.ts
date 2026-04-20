import { format, parseISO, isAfter, isBefore, differenceInSeconds } from "date-fns";
import type { AppEvent } from "./types";

export const fmtDate = (iso: string) => format(parseISO(iso), "MMM d, yyyy");
export const fmtDateLong = (iso: string) => format(parseISO(iso), "EEEE, MMMM d, yyyy");
export const fmtMoney = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export function isUpcoming(e: AppEvent) {
  return !isBefore(parseISO(e.date), new Date(new Date().toDateString()));
}
export function isPast(e: AppEvent) {
  return isBefore(parseISO(e.date), new Date(new Date().toDateString()));
}

export function rsvpCounts(e: AppEvent) {
  const c = { attending: 0, maybe: 0, declined: 0, pending: 0 };
  for (const g of e.guests) c[g.rsvp]++;
  return c;
}

export function rsvpRate(e: AppEvent) {
  if (e.guests.length === 0) return 0;
  const c = rsvpCounts(e);
  return Math.round(((c.attending + c.maybe + c.declined) / e.guests.length) * 100);
}

export function countdown(iso: string, time: string) {
  const target = parseISO(`${iso}T${time}:00`);
  const now = new Date();
  const total = differenceInSeconds(target, now);
  if (total <= 0) return { past: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { past: false, days, hours, minutes, seconds };
}

export { isAfter, isBefore };
