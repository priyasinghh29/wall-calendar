import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { MONTH_THEMES } from "./monthThemes";

// Free ambient sound URLs from freesound.org (Creative Commons)
const MONTH_SOUNDS: Record<number, { url: string; label: string }> = {
  0: { url: "https://cdn.freesound.org/previews/531/531947_2366-lq.mp3", label: "Winter Wind" },
  1: { url: "https://cdn.freesound.org/previews/462/462087_9497060-lq.mp3", label: "Gentle Rain" },
  2: { url: "https://cdn.freesound.org/previews/527/527618_2366-lq.mp3", label: "Spring Birds" },
  3: { url: "https://cdn.freesound.org/previews/462/462087_9497060-lq.mp3", label: "April Rain" },
  4: { url: "https://cdn.freesound.org/previews/527/527618_2366-lq.mp3", label: "Garden Birds" },
  5: { url: "https://cdn.freesound.org/previews/467/467006_5765286-lq.mp3", label: "Ocean Waves" },
  6: { url: "https://cdn.freesound.org/previews/467/467006_5765286-lq.mp3", label: "Beach Waves" },
  7: { url: "https://cdn.freesound.org/previews/398/398632_7562731-lq.mp3", label: "Summer Night" },
  8: { url: "https://cdn.freesound.org/previews/531/531947_2366-lq.mp3", label: "Autumn Wind" },
  9: { url: "https://cdn.freesound.org/previews/531/531947_2366-lq.mp3", label: "Fall Breeze" },
  10: { url: "https://cdn.freesound.org/previews/462/462087_9497060-lq.mp3", label: "Cozy Rain" },
  11: { url: "https://cdn.freesound.org/previews/398/398632_7562731-lq.mp3", label: "Fireplace" },
};

interface AmbientPlayerProps {
  month: number;
}

export default function AmbientPlayer({ month }: AmbientPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sound = MONTH_SOUNDS[month];
  const theme = MONTH_THEMES[month];

  useEffect(() => {
    // Stop and reset when month changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [month]);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(sound.url);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-3 py-1.5 shadow-lg">
      <button
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-all"
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 text-primary-foreground" />
        ) : (
          <Play className="w-3.5 h-3.5 text-primary-foreground ml-0.5" />
        )}
      </button>

      <div className="flex flex-col">
        <span className="text-[9px] font-semibold text-primary-foreground/90 leading-tight">
          {sound.label}
        </span>
        <span className="text-[8px] text-primary-foreground/50 leading-tight">
          {theme.mood}
        </span>
      </div>

      {isPlaying && (
        <>
          {/* Animated bars */}
          <div className="flex items-end gap-0.5 h-3 mx-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-0.5 bg-primary-foreground/60 rounded-full"
                style={{
                  animation: `soundbar 0.${4 + i}s ease-in-out infinite alternate`,
                  height: `${4 + i * 3}px`,
                }}
              />
            ))}
          </div>

          <button
            onClick={toggleMute}
            className="text-primary-foreground/60 hover:text-primary-foreground/90 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </>
      )}
    </div>
  );
}
