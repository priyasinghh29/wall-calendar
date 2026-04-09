import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DAY_NAMES, DayInfo, getDaysForMonth, MONTH_NAMES } from "./calendarData";
import { WeatherDay } from "./useWeather";

const MONTH_ABBRS = MONTH_NAMES.map(m => m.slice(0, 3));

function parseDateLabel(label: string, fallbackYear: number): Date | null {
  const parts = label.trim().split(" ");
  if (parts.length < 2) return null;
  const mi = MONTH_ABBRS.indexOf(parts[0]);
  if (mi === -1) return null;
  const d = parseInt(parts[1]);
  if (isNaN(d)) return null;
  return new Date(fallbackYear, mi, d);
}

function isDateInNoteRange(dateKey: string, dateRange: string, year: number): boolean {
  const parts = dateRange.split(" – ");
  if (parts.length === 1) {
    const d = parseDateLabel(parts[0], year);
    if (!d) return false;
    const dk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return dk === dateKey;
  }
  const s = parseDateLabel(parts[0], year);
  const e = parseDateLabel(parts[1], year);
  if (!s || !e) return false;
  const target = new Date(dateKey + "T00:00:00");
  const start = Math.min(s.getTime(), e.getTime());
  const end = Math.max(s.getTime(), e.getTime());
  return target.getTime() >= start && target.getTime() <= end;
}

interface Note {
  id: string;
  text: string;
  dateRange?: string;
  createdAt: Date;
}

interface CalendarGridProps {
  year: number;
  month: number;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onDayClick: (day: DayInfo) => void;
  onDayHover: (day: DayInfo) => void;
  hoverDate: Date | null;
  noteDates: Set<string>;
  notes: Note[];
  weather: Record<string, WeatherDay>;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = date.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return t >= s && t <= e;
}

function isRangeStart(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start) return false;
  if (!end) return isSameDay(date, start);
  const s = start.getTime() <= end.getTime() ? start : end;
  return isSameDay(date, s);
}

function isRangeEnd(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const e = start.getTime() <= end.getTime() ? end : start;
  return isSameDay(date, e);
}

export default function CalendarGrid({
  year, month, rangeStart, rangeEnd, onDayClick, onDayHover, hoverDate, noteDates, notes, weather,
}: CalendarGridProps) {
  const days = useMemo(() => getDaysForMonth(year, month), [year, month]);
  const [hoveredDay, setHoveredDay] = useState<DayInfo | null>(null);

  const effectiveEnd = rangeEnd || hoverDate;

  return (
    <div className="w-full relative">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={cn(
              "text-center text-[10px] font-medium font-body py-2.5 uppercase tracking-[0.15em]",
              i >= 5 ? "text-calendar-weekend/50" : "text-muted-foreground/40"
            )}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day, idx) => {
          const inRange = isInRange(day.date, rangeStart, effectiveEnd);
          const isStart = isRangeStart(day.date, rangeStart, effectiveEnd);
          const isEnd = isRangeEnd(day.date, rangeStart, effectiveEnd);
          const hasNote = noteDates.has(day.dateKey);
          const w = weather[day.dateKey];

          return (
            <div key={idx} className="relative group">
              <button
                onClick={() => day.isCurrentMonth && onDayClick(day)}
                onMouseEnter={() => {
                  if (day.isCurrentMonth) {
                    onDayHover(day);
                    setHoveredDay(day);
                  }
                }}
                onMouseLeave={() => setHoveredDay(null)}
                className={cn(
                  "relative w-full flex flex-col items-center justify-center py-3 md:py-3.5 transition-all duration-150 text-sm font-body font-medium",
                  !day.isCurrentMonth && "opacity-15 cursor-default",
                  day.isCurrentMonth && "cursor-pointer hover:bg-accent/60 rounded-lg",
                  inRange && day.isCurrentMonth && "bg-calendar-range",
                  isStart && day.isCurrentMonth && "bg-primary text-primary-foreground rounded-l-xl rounded-r-none hover:bg-primary",
                  isEnd && day.isCurrentMonth && "bg-primary text-primary-foreground rounded-r-xl rounded-l-none hover:bg-primary",
                  isStart && isEnd && "rounded-xl",
                  day.isToday && !isStart && !isEnd && "font-bold",
                  day.isWeekend && day.isCurrentMonth && !isStart && !isEnd && "text-calendar-weekend",
                )}
              >
                {/* Today highlight */}
                {day.isToday && !isStart && !isEnd && (
                  <>
                    <span className="absolute inset-1 rounded-lg border-2 border-primary/60 animate-pulse-soft pointer-events-none" />
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 text-[7px] font-bold text-primary uppercase tracking-wider pointer-events-none">
                      Today
                    </span>
                  </>
                )}

                {/* Weather emoji */}
                {w && day.isCurrentMonth && (
                  <span className="absolute top-0 right-0.5 text-[8px] pointer-events-none leading-none">
                    {w.emoji}
                  </span>
                )}

                <span className="relative z-10">{day.day}</span>

                {/* Holiday red dot */}
                {day.holiday && day.isCurrentMonth && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-calendar-holiday" />
                )}

                {/* Note dot (only if no holiday dot) */}
                {hasNote && day.isCurrentMonth && !day.holiday && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-calendar-note-dot" />
                )}
              </button>

              {/* Hover tooltip for holidays */}
              {hoveredDay && isSameDay(hoveredDay.date, day.date) && day.holiday && day.isCurrentMonth && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg shadow-lg px-3 py-2 whitespace-nowrap animate-scale-in pointer-events-none">
                  <p className="text-[10px] font-semibold text-primary">{day.holiday}</p>
                  {w && <p className="text-[9px] text-muted-foreground">{w.emoji} {w.tempMax}°C</p>}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45 -mt-1" />
                </div>
              )}

              {/* Hover tooltip for weather (non-holiday) */}
              {hoveredDay && isSameDay(hoveredDay.date, day.date) && !day.holiday && w && day.isCurrentMonth && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg shadow-lg px-3 py-2 whitespace-nowrap animate-scale-in pointer-events-none">
                  <p className="text-[10px] text-foreground">{w.emoji} {w.tempMax}°C</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45 -mt-1" />
                </div>
              )}

              {/* Hover tooltip for notes */}
              {hoveredDay && isSameDay(hoveredDay.date, day.date) && hasNote && day.isCurrentMonth && (() => {
                const dayNotes = notes.filter(n => n.dateRange && isDateInNoteRange(day.dateKey, n.dateRange, year));
                if (dayNotes.length === 0) return null;
                return (
                  <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg shadow-lg px-3 py-2 max-w-[180px] animate-scale-in pointer-events-none">
                    <p className="text-[9px] font-semibold text-primary mb-1">📝 Notes</p>
                    {dayNotes.slice(0, 3).map(n => (
                      <p key={n.id} className="text-[10px] text-foreground truncate">{n.text}</p>
                    ))}
                    {dayNotes.length > 3 && <p className="text-[9px] text-muted-foreground">+{dayNotes.length - 3} more</p>}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45 -mt-1" />
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
