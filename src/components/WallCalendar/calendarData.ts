import januaryImg from "@/assets/calendar-january.jpg";
import februaryImg from "@/assets/calendar-february.jpg";
import marchImg from "@/assets/calendar-march.jpg";
import aprilImg from "@/assets/calendar-april.jpg";
import mayImg from "@/assets/calendar-may.jpg";
import juneImg from "@/assets/calendar-june.jpg";
import julyImg from "@/assets/calendar-july.jpg";
import augustImg from "@/assets/calendar-august.jpg";
import septemberImg from "@/assets/calendar-september.jpg";
import octoberImg from "@/assets/calendar-october.jpg";
import novemberImg from "@/assets/calendar-november.jpg";
import decemberImg from "@/assets/calendar-december.jpg";

export const MONTH_IMAGES: Record<number, string> = {
  0: januaryImg,
  1: februaryImg,
  2: marchImg,
  3: aprilImg,
  4: mayImg,
  5: juneImg,
  6: julyImg,
  7: augustImg,
  8: septemberImg,
  9: octoberImg,
  10: novemberImg,
  11: decemberImg,
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// US holidays for 2025/2026
export const HOLIDAYS: Record<string, string> = {
  "2025-01-01": "New Year's Day",
  "2025-01-20": "MLK Day",
  "2025-02-17": "Presidents' Day",
  "2025-05-26": "Memorial Day",
  "2025-07-04": "Independence Day",
  "2025-09-01": "Labor Day",
  "2025-10-13": "Columbus Day",
  "2025-11-11": "Veterans Day",
  "2025-11-27": "Thanksgiving",
  "2025-12-25": "Christmas",
  "2026-01-01": "New Year's Day",
  "2026-01-19": "MLK Day",
  "2026-02-16": "Presidents' Day",
  "2026-04-08": "Today",
  "2026-05-25": "Memorial Day",
  "2026-07-04": "Independence Day",
  "2026-09-07": "Labor Day",
  "2026-10-12": "Columbus Day",
  "2026-11-11": "Veterans Day",
  "2026-11-26": "Thanksgiving",
  "2026-12-25": "Christmas",
};

export interface DayInfo {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holiday?: string;
  dateKey: string;
}

export function getDaysForMonth(year: number, month: number): DayInfo[] {
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  // Monday-based: 0=Mon, 6=Sun
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: DayInfo[] = [];

  // Previous month fill
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const date = new Date(year, month - 1, d);
    const dow = date.getDay();
    const dateKey = formatDateKey(date);
    days.push({
      date,
      day: d,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: dow === 0 || dow === 6,
      holiday: HOLIDAYS[dateKey],
      dateKey,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    const dateKey = formatDateKey(date);
    days.push({
      date,
      day: d,
      isCurrentMonth: true,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      isWeekend: dow === 0 || dow === 6,
      holiday: HOLIDAYS[dateKey],
      dateKey,
    });
  }

  // Next month fill
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    const dow = date.getDay();
    const dateKey = formatDateKey(date);
    days.push({
      date,
      day: d,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: dow === 0 || dow === 6,
      holiday: HOLIDAYS[dateKey],
      dateKey,
    });
  }

  return days;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
