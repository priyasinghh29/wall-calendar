// Dynamic month-based theme colors (HSL values)
export interface MonthTheme {
  primary: string;
  accent: string;
  range: string;
  weekend: string;
  holiday: string;
  noteDot: string;
  heroOverlay: string;
  mood: string;
  weatherDefault: string;
}

export const MONTH_THEMES: Record<number, MonthTheme> = {
  0: { // January - Icy blue
    primary: "210 70% 55%",
    accent: "210 50% 92%",
    range: "210 50% 92%",
    weekend: "210 40% 60%",
    holiday: "0 72% 55%",
    noteDot: "210 70% 55%",
    heroOverlay: "from-[hsl(210,70%,55%,0.4)] via-transparent to-[hsl(210,70%,55%,0.05)]",
    mood: "❄️ Winter Calm",
    weatherDefault: "❄️",
  },
  1: { // February - Rose / Valentine
    primary: "340 75% 58%",
    accent: "340 55% 92%",
    range: "340 55% 92%",
    weekend: "340 45% 62%",
    holiday: "0 72% 55%",
    noteDot: "340 75% 58%",
    heroOverlay: "from-[hsl(340,75%,58%,0.4)] via-transparent to-[hsl(340,75%,58%,0.05)]",
    mood: "💕 Love Month",
    weatherDefault: "🌨️",
  },
  2: { // March - Fresh green
    primary: "140 55% 45%",
    accent: "140 40% 92%",
    range: "140 40% 92%",
    weekend: "140 35% 55%",
    holiday: "0 72% 55%",
    noteDot: "140 55% 45%",
    heroOverlay: "from-[hsl(140,55%,45%,0.4)] via-transparent to-[hsl(140,55%,45%,0.05)]",
    mood: "🌱 Spring Awakening",
    weatherDefault: "🌤️",
  },
  3: { // April - Soft lavender
    primary: "270 50% 58%",
    accent: "270 40% 93%",
    range: "270 40% 93%",
    weekend: "270 35% 60%",
    holiday: "0 72% 55%",
    noteDot: "270 50% 58%",
    heroOverlay: "from-[hsl(270,50%,58%,0.4)] via-transparent to-[hsl(270,50%,58%,0.05)]",
    mood: "🌸 April Showers",
    weatherDefault: "🌧️",
  },
  4: { // May - Warm golden
    primary: "45 80% 50%",
    accent: "45 60% 92%",
    range: "45 60% 92%",
    weekend: "45 55% 55%",
    holiday: "0 72% 55%",
    noteDot: "45 80% 50%",
    heroOverlay: "from-[hsl(45,80%,50%,0.4)] via-transparent to-[hsl(45,80%,50%,0.05)]",
    mood: "🌼 Bloom Season",
    weatherDefault: "☀️",
  },
  5: { // June - Ocean blue
    primary: "195 75% 48%",
    accent: "195 55% 92%",
    range: "195 55% 92%",
    weekend: "195 50% 55%",
    holiday: "0 72% 55%",
    noteDot: "195 75% 48%",
    heroOverlay: "from-[hsl(195,75%,48%,0.4)] via-transparent to-[hsl(195,75%,48%,0.05)]",
    mood: "🌊 Summer Vibes",
    weatherDefault: "☀️",
  },
  6: { // July - Fiery orange
    primary: "25 85% 55%",
    accent: "25 60% 92%",
    range: "25 60% 92%",
    weekend: "25 55% 58%",
    holiday: "0 72% 55%",
    noteDot: "25 85% 55%",
    heroOverlay: "from-[hsl(25,85%,55%,0.4)] via-transparent to-[hsl(25,85%,55%,0.05)]",
    mood: "🔥 Peak Summer",
    weatherDefault: "☀️",
  },
  7: { // August - Sunset amber
    primary: "35 80% 52%",
    accent: "35 55% 92%",
    range: "35 55% 92%",
    weekend: "35 50% 56%",
    holiday: "0 72% 55%",
    noteDot: "35 80% 52%",
    heroOverlay: "from-[hsl(35,80%,52%,0.4)] via-transparent to-[hsl(35,80%,52%,0.05)]",
    mood: "🌅 Golden Days",
    weatherDefault: "☀️",
  },
  8: { // September - Warm sienna
    primary: "20 65% 50%",
    accent: "20 45% 92%",
    range: "20 45% 92%",
    weekend: "20 40% 55%",
    holiday: "0 72% 55%",
    noteDot: "20 65% 50%",
    heroOverlay: "from-[hsl(20,65%,50%,0.4)] via-transparent to-[hsl(20,65%,50%,0.05)]",
    mood: "🍂 Early Autumn",
    weatherDefault: "🌤️",
  },
  9: { // October - Deep orange / Halloween
    primary: "25 80% 48%",
    accent: "25 55% 92%",
    range: "25 55% 92%",
    weekend: "25 50% 55%",
    holiday: "0 72% 55%",
    noteDot: "25 80% 48%",
    heroOverlay: "from-[hsl(25,80%,48%,0.4)] via-transparent to-[hsl(25,80%,48%,0.05)]",
    mood: "🎃 Spooky Season",
    weatherDefault: "🌧️",
  },
  10: { // November - Muted brown
    primary: "30 45% 45%",
    accent: "30 30% 92%",
    range: "30 30% 92%",
    weekend: "30 25% 55%",
    holiday: "0 72% 55%",
    noteDot: "30 45% 45%",
    heroOverlay: "from-[hsl(30,45%,45%,0.4)] via-transparent to-[hsl(30,45%,45%,0.05)]",
    mood: "🍁 Harvest Time",
    weatherDefault: "🌨️",
  },
  11: { // December - Rich crimson
    primary: "350 70% 48%",
    accent: "350 50% 92%",
    range: "350 50% 92%",
    weekend: "350 45% 55%",
    holiday: "0 72% 55%",
    noteDot: "350 70% 48%",
    heroOverlay: "from-[hsl(350,70%,48%,0.4)] via-transparent to-[hsl(350,70%,48%,0.05)]",
    mood: "🎄 Holiday Season",
    weatherDefault: "❄️",
  },
};

export function applyMonthTheme(month: number) {
  const theme = MONTH_THEMES[month];
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--calendar-range", theme.range);
  root.style.setProperty("--calendar-weekend", theme.weekend);
  root.style.setProperty("--calendar-holiday", theme.holiday);
  root.style.setProperty("--calendar-note-dot", theme.noteDot);
  root.style.setProperty("--ring", theme.primary);
}
