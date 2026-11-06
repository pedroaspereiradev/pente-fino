"use client";

import { useRef, useState } from "react";
import { BigPauseIcon, BigPlayIcon, ExternalLinkIcon, HeartIcon, RepeatIcon } from "./icons";

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function Player({
  src,
  title,
  deezerLink,
  accent,
  onAccent,
}: {
  src: string;
  title: string;
  deezerLink: string;
  accent: string;
  onAccent: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setFailed(true));
  }

  function restart() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().then(() => setPlaying(true)).catch(() => setFailed(true));
  }

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            {failed ? "prévia indisponível agora" : "Porta de entrada · prévia"}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
        </div>
        <button
          type="button"
          aria-label="Curtir"
          onClick={() => setLiked((v) => !v)}
          style={{
            width: 40,
            height: 40,
            border: 0,
            borderRadius: 999,
            background: liked ? accent : "rgba(255,255,255,0.12)",
            color: liked ? onAccent : "#F4F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HeartIcon />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", height: 10 }}>
          <div
            style={{
              width: `${progress * 100}%`,
              height: 3,
              borderRadius: 999,
              background: accent,
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: accent,
              marginLeft: -4,
            }}
          />
          <div
            style={{
              flexGrow: 1,
              height: 3,
              borderRadius: 999,
              background: "rgba(255,255,255,0.2)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          aria-label="Repetir prévia"
          onClick={restart}
          style={{
            width: 48,
            height: 48,
            border: 0,
            borderRadius: 999,
            background: "rgba(0,0,0,0.3)",
            color: "#F4F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RepeatIcon />
        </button>
        <button
          type="button"
          aria-label={playing ? `Pausar prévia de ${title}` : `Tocar prévia de ${title}`}
          onClick={togglePlay}
          style={{
            width: 96,
            height: 52,
            border: 0,
            borderRadius: 999,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {playing ? <BigPauseIcon color={onAccent} /> : <BigPlayIcon color={onAccent} />}
        </button>
        <a
          href={deezerLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir no streaming"
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: "rgba(0,0,0,0.3)",
            color: "#F4F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ExternalLinkIcon />
        </a>
      </div>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 30)}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
