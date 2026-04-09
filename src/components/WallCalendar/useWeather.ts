import { useState, useEffect } from "react";

// WMO weather code to emoji mapping
const WMO_TO_EMOJI: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  66: "🌨️", 67: "🌨️",
  71: "❄️", 73: "❄️", 75: "❄️",
  77: "❄️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  85: "🌨️", 86: "🌨️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

function wmoToEmoji(code: number): string {
  return WMO_TO_EMOJI[code] || "🌤️";
}

export interface WeatherDay {
  date: string; // YYYY-MM-DD
  emoji: string;
  tempMax?: number;
}

export function useWeather(year: number, month: number): Record<string, WeatherDay> {
  const [weather, setWeather] = useState<Record<string, WeatherDay>>({});

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchWeather = async () => {
      try {
        const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;
        
        const today = new Date();
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month, daysInMonth);
        
        const results: Record<string, WeatherDay> = {};

        // Past/current dates - use archive or current
        if (monthStart <= today) {
          const pastEnd = monthEnd <= today ? endDate : formatDate(today);
          const url = `https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=-77.20&daily=weather_code,temperature_2m_max&start_date=${startDate}&end_date=${pastEnd}&timezone=auto`;
          
          const res = await fetch(url, { signal: controller.signal });
          if (res.ok) {
            const data = await res.json();
            data.daily?.time?.forEach((date: string, i: number) => {
              results[date] = {
                date,
                emoji: wmoToEmoji(data.daily.weather_code[i]),
                tempMax: Math.round(data.daily.temperature_2m_max[i]),
              };
            });
          }
        }

        // Future dates - forecast (up to 16 days)
        if (monthEnd > today) {
          const futureStart = monthStart > today ? startDate : formatDate(new Date(today.getTime() + 86400000));
          const url = `https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&daily=weather_code,temperature_2m_max&start_date=${futureStart}&end_date=${endDate}&timezone=auto`;

          
          const res = await fetch(url, { signal: controller.signal });
          if (res.ok) {
            const data = await res.json();
            data.daily?.time?.forEach((date: string, i: number) => {
              if (!results[date]) {
                results[date] = {
                  date,
                  emoji: wmoToEmoji(data.daily.weather_code[i]),
                  tempMax: Math.round(data.daily.temperature_2m_max[i]),
                };
              }
            });
          }
        }

        setWeather(results);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.warn("Weather fetch failed:", err);
        }
      }
    };

    fetchWeather();
    return () => controller.abort();
  }, [year, month]);

  return weather;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
