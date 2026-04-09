import { useState } from "react";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, Plus, StickyNote, CalendarDays } from "lucide-react";

interface Note {
  id: string;
  text: string;
  dateRange?: string;
  createdAt: Date;
}

interface NotesPanelProps {
  notes: Note[];
  onAddNote: (text: string) => void;
  onDeleteNote: (id: string) => void;
  rangeLabel: string | null;
}

export default function NotesPanel({ notes, onAddNote, onDeleteNote, rangeLabel }: NotesPanelProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    onAddNote(input.trim());
    setInput("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <StickyNote className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">Notes</h3>
        {notes.length > 0 && (
          <span className="ml-auto text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {notes.length}
          </span>
        )}
      </div>

      {rangeLabel && (
        <div className="flex items-center gap-2 text-xs text-primary mb-3 bg-accent/60 border border-primary/15 rounded-lg px-3 py-2">
          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
          <span className="font-medium">{rangeLabel}</span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a note..."
          className="flex-1 bg-card border border-border rounded-xl px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="bg-primary text-primary-foreground rounded-xl px-3 py-2.5 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {notes.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <div className="w-12 h-12 rounded-2xl bg-accent/60 flex items-center justify-center mx-auto mb-3">
              <Pencil className="w-5 h-5 opacity-40" />
            </div>
            <p className="text-sm font-medium">No notes yet</p>
            <p className="text-xs mt-1 text-muted-foreground/60">Select dates and add notes</p>
          </div>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="group bg-card border border-border rounded-xl px-3.5 py-3 animate-fade-up hover:shadow-md hover:border-primary/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            {note.dateRange && (
              <div className="flex items-center gap-1.5 mb-1.5">
                <CalendarDays className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                  {note.dateRange}
                </span>
              </div>
            )}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">{note.text}</p>
                <p className="text-[10px] text-muted-foreground/50 mt-1.5">
                  {formatTime(note.createdAt)}
                </p>
              </div>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive shrink-0 mt-0.5 p-1 rounded-md hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
