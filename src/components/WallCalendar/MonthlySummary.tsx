import { CalendarDays, StickyNote, TrendingUp, X } from "lucide-react";

interface Note {
  id: string;
  text: string;
  dateRange?: string;
  createdAt: Date;
}

interface MonthlySummaryProps {
  month: string;
  year: number;
  notes: Note[];
  totalSelected: number;
  onClose: () => void;
}

export default function MonthlySummary({ month, year, notes, totalSelected, onClose }: MonthlySummaryProps) {
  const notesThisMonth = notes.length;

  // Find busiest week (based on note creation dates)
  const weekCounts: Record<number, number> = {};
  notes.forEach((n) => {
    const week = getWeekOfMonth(n.createdAt);
    weekCounts[week] = (weekCounts[week] || 0) + 1;
  });
  const busiestWeek = Object.entries(weekCounts).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="animate-scale-in bg-card border border-border rounded-2xl p-5 shadow-lg relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h4 className="font-display text-base font-bold text-foreground">Monthly Recap</h4>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-accent">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground font-body mb-4">
        {month} {year} — Your calendar summary
      </p>

      <div className="grid grid-cols-3 gap-3 relative z-10">
        <div className="bg-accent/60 rounded-xl p-3 text-center">
          <StickyNote className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{notesThisMonth}</p>
          <p className="text-[10px] text-muted-foreground">Notes</p>
        </div>
        <div className="bg-accent/60 rounded-xl p-3 text-center">
          <CalendarDays className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{totalSelected}</p>
          <p className="text-[10px] text-muted-foreground">Days Selected</p>
        </div>
        <div className="bg-accent/60 rounded-xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">
            {busiestWeek ? `Wk ${busiestWeek[0]}` : "—"}
          </p>
          <p className="text-[10px] text-muted-foreground">Busiest</p>
        </div>
      </div>
    </div>
  );
}

function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + firstDay) / 7);
}
