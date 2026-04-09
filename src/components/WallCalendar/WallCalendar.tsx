import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Star, CalendarDays, X, Sun, Moon, TrendingUp } from "lucide-react";
import { MONTH_IMAGES, MONTH_NAMES, HOLIDAYS, DayInfo, formatDateKey } from "./calendarData";
import { applyMonthTheme, MONTH_THEMES } from "./monthThemes";
import { useWeather } from "./useWeather";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import AmbientPlayer from "./AmbientPlayer";
import MonthlySummary from "./MonthlySummary";
import confetti from "canvas-confetti";

interface Note {
  id: string;
  text: string;
  dateRange?: string;
  createdAt: Date;
}

export default function WallCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [isFlipping, setIsFlipping] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectingEnd, setSelectingEnd] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);
  const [tooltipDay, setTooltipDay] = useState<DayInfo | null>(null);

  const heroRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const weather = useWeather(year, month);

  // Apply month theme on mount and month change
  useEffect(() => {
    applyMonthTheme(month);
  }, [month]);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrolled = -rect.top;
        if (scrolled > 0) {
          heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
        } else {
          heroRef.current.style.transform = "translateY(0)";
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parseDateLabel = (label: string, yr: number): string | null => {
    const monthAbbrs = MONTH_NAMES.map(m => m.slice(0, 3));
    const parts = label.trim().split(" ");
    if (parts.length < 2) return null;
    const mi = monthAbbrs.indexOf(parts[0]);
    if (mi === -1) return null;
    const d = parseInt(parts[1]);
    if (isNaN(d)) return null;
    return `${yr}-${String(mi + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const noteDates = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (n.dateRange) {
        // Store the dateRange string as-is for matching
        // dateRange is like "Apr 9" or "Apr 9 – Apr 12"
        // We store individual dateKeys for each note
        const parts = n.dateRange.split(" – ");
        if (parts.length === 1) {
          // Single date - parse "Mon D" to dateKey
          const dk = parseDateLabel(parts[0], year);
          if (dk) set.add(dk);
        } else {
          // Range - parse start and end, fill all days between
          const startDk = parseDateLabel(parts[0], year);
          const endDk = parseDateLabel(parts[1], year);
          if (startDk && endDk) {
            const s = new Date(startDk);
            const e = new Date(endDk);
            const cur = new Date(Math.min(s.getTime(), e.getTime()));
            const end = new Date(Math.max(s.getTime(), e.getTime()));
            while (cur <= end) {
              set.add(formatDateKey(cur));
              cur.setDate(cur.getDate() + 1);
            }
          }
        }
      }
    });
    return set;
  }, [notes, year]);

  const navigateMonth = useCallback((dir: -1 | 1) => {
    setIsFlipping(true);
    setTimeout(() => {
      let newMonth = month + dir;
      let newYear = year;
      if (newMonth < 0) { newMonth = 11; newYear--; }
      if (newMonth > 11) { newMonth = 0; newYear++; }
      setMonth(newMonth);
      setYear(newYear);
      setIsFlipping(false);
    }, 300);
  }, [month, year]);

  const goToToday = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setYear(today.getFullYear());
      setMonth(today.getMonth());
      setIsFlipping(false);
    }, 300);
  };

  const handleDayClick = (day: DayInfo) => {
  console.log("Day clicked:", day.day, day.isCurrentMonth);
  if (!selectingEnd) {
    setRangeStart(day.date);
    setRangeEnd(null);
    setSelectingEnd(true);
  } else {
    setRangeEnd(day.date);
    setSelectingEnd(false);
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.7 },
      colors: [`hsl(${MONTH_THEMES[month].primary.split(" ").join(",")})`, "#fff", "#ffd700"],
      disableForReducedMotion: true,
    });
  }
};

  const handleDayHover = (day: DayInfo) => {
    if (selectingEnd) setHoverDate(day.date);
    setTooltipDay(day.holiday ? day : null);
  };

  const rangeLabel = useMemo(() => {
    if (!rangeStart) return null;
    const fmt = (d: Date) => `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
    if (!rangeEnd) return fmt(rangeStart);
    const s = rangeStart.getTime() <= rangeEnd.getTime() ? rangeStart : rangeEnd;
    const e = rangeStart.getTime() <= rangeEnd.getTime() ? rangeEnd : rangeStart;
    return `${fmt(s)} – ${fmt(e)}`;
  }, [rangeStart, rangeEnd]);

  const rangeDayCount = useMemo(() => {
    if (!rangeStart || !rangeEnd) return 0;
    const diff = Math.abs(rangeEnd.getTime() - rangeStart.getTime());
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [rangeStart, rangeEnd]);

  const addNote = (text: string) => {
    setNotes((prev) => [
      {
        id: crypto.randomUUID(),
        text,
        dateRange: rangeLabel || undefined,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const clearRange = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelectingEnd(false);
  };

  const heroImage = MONTH_IMAGES[month];
  const theme = MONTH_THEMES[month];

  return (
    <div ref={containerRef} className="min-h-screen paper-bg flex items-center justify-center p-4 md:p-8 transition-colors duration-700">
      <div className="w-full max-w-5xl">
        {/* Dark/Light toggle */}
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="relative w-14 h-7 rounded-full bg-accent border border-border transition-all duration-500 flex items-center px-1 group"
          >
            <div className={cn(
              "w-5 h-5 rounded-full bg-primary flex items-center justify-center transition-all duration-500 shadow-md",
              isDark ? "translate-x-7" : "translate-x-0"
            )}>
              {isDark ? <Moon className="w-3 h-3 text-primary-foreground" /> : <Sun className="w-3 h-3 text-primary-foreground" />}
            </div>
          </button>
        </div>

        {/* Hanger effect */}
        <div className="flex justify-center mb-0 relative z-10">
          <div className="flex items-end gap-16">
            <div className="w-px h-8 bg-muted-foreground/30" />
            <div className="w-24 h-1.5 rounded-full bg-muted-foreground/20 relative -mb-px">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-muted-foreground/20 bg-background" />
            </div>
            <div className="w-px h-8 bg-muted-foreground/30" />
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.15),0_20px_60px_-15px_hsl(var(--foreground)/0.1)] transition-shadow duration-700">
          {/* Top: Hero Image with parallax */}
          <div className={cn(
            "relative overflow-hidden",
            isFlipping && "animate-page-flip"
          )}
            style={isFlipping ? {
              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.25))",
            } : undefined}
          >
            <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
              <img
                ref={heroRef}
                src={heroImage}
                alt={MONTH_NAMES[month]}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 will-change-transform"
              />
              {/* Dynamic gradient overlay */}
              <div className={cn("absolute inset-0 bg-gradient-to-t", theme.heroOverlay)} />
              {/* Extra dark bottom for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Month/Year label - prominent */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="text-primary-foreground/80 text-xs font-body font-medium tracking-[0.25em] uppercase mb-1">
                    {year}
                  </div>
                  <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-tight"
                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)" }}>
                    {MONTH_NAMES[month]}
                  </h2>
                  <p className="text-primary-foreground/60 text-xs font-body mt-1">{theme.mood}</p>
                </div>

                {/* Ambient Player */}
                <div className="hidden sm:block">
                  <AmbientPlayer month={month} />
                </div>
              </div>

              {/* Wavy accent */}
              <div className="absolute bottom-0 left-0 w-full">
                <svg viewBox="0 0 1200 30" className="w-full h-[20px]" preserveAspectRatio="none">
                  <path d="M0,30 L0,18 Q300,6 600,15 Q900,24 1200,10 L1200,30 Z" fill="hsl(var(--card))" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom: Calendar Grid + Notes */}
          <div className="flex flex-col lg:flex-row min-h-[400px]">
            {/* Notes panel */}
            <div className="order-2 lg:order-1 lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-r border-border p-5 bg-accent/20">
              <NotesPanel
                notes={notes}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
                rangeLabel={rangeLabel}
              />
            </div>

            {/* Calendar grid */}
            <div className="order-1 lg:order-2 flex-1 p-5 md:p-6 min-h-[350px]">
              {/* Navigation */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2.5 rounded-xl hover:bg-accent transition-colors text-foreground"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={goToToday}
                    className="flex items-center gap-1.5 text-xs font-body font-medium text-primary hover:text-primary/80 transition-colors bg-accent/60 px-3 py-1.5 rounded-full"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    Today
                  </button>
                  <button
                    onClick={() => setShowSummary(!showSummary)}
                    className="flex items-center gap-1.5 text-xs font-body font-medium text-muted-foreground hover:text-foreground transition-colors bg-accent/40 px-3 py-1.5 rounded-full"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Summary
                  </button>
                  {rangeStart && (
                    <button
                      onClick={clearRange}
                      className="flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2.5 rounded-xl hover:bg-accent transition-colors text-foreground"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Monthly Summary Card */}
              {showSummary && (
                <div className="mb-4">
                  <MonthlySummary
                    month={MONTH_NAMES[month]}
                    year={year}
                    notes={notes}
                    totalSelected={rangeDayCount}
                    onClose={() => setShowSummary(false)}
                  />
                </div>
              )}

              {/* Selected Range Info Bar */}
              {rangeStart && rangeEnd && (
                <div className="mb-4 flex items-center justify-between bg-accent/60 border border-primary/20 rounded-xl px-4 py-3 animate-fade-up">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary font-body">{rangeLabel}</p>
                      <p className="text-[11px] text-muted-foreground font-body">{rangeDayCount} day{rangeDayCount !== 1 ? 's' : ''} selected</p>
                    </div>
                  </div>
                  <button onClick={clearRange} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Selection hint */}
              {selectingEnd && (
                <div className="text-center text-xs text-primary font-body mb-3 animate-fade-up bg-accent/40 rounded-lg py-2">
                  Click another date to complete range
                </div>
              )}

              <CalendarGrid
                year={year}
                month={month}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onDayClick={handleDayClick}
                onDayHover={handleDayHover}
                hoverDate={hoverDate}
                noteDates={noteDates}
                notes={notes}
                weather={weather}
              />

              {/* Holiday legend */}
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted-foreground font-body">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-calendar-holiday" /> Holiday
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-calendar-note-dot" /> Has note
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-primary animate-pulse-soft" /> Today
                </span>
                <span className="flex items-center gap-1.5">
                  ☀️ Weather
                </span>
                {tooltipDay?.holiday && (
                  <span className="ml-auto text-calendar-holiday font-medium animate-fade-up">
                    <Star className="w-3 h-3 inline mr-1" />
                    {tooltipDay.holiday}
                  </span>
                )}
              </div>

              {/* Mobile ambient player */}
              <div className="sm:hidden mt-4">
                <AmbientPlayer month={month} />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle shadow below card */}
        <div className="mx-8 h-6 bg-gradient-to-b from-foreground/8 to-transparent rounded-b-3xl" />

        {/* Branding */}
        <p className="text-center text-[10px] text-muted-foreground/40 mt-3 font-body tracking-widest uppercase">
          Wall Calendar · {year}
        </p>
      </div>
    </div>
  );
}
