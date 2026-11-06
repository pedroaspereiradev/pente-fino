"use client";

import { useRef, useState } from "react";

type PreviewPlayerProps = {
  src: string;
  title: string;
};

export function PreviewPlayer({ src, title }: PreviewPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  function toggle() {
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

  return (
    <div className="flex items-center gap-3 rounded-full bg-black/45 px-3 py-2 backdrop-blur-sm">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar prévia" : "Tocar prévia"}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-brand-cream transition-opacity hover:opacity-80"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold leading-tight">{title}</p>
        <p className="text-xs font-light leading-tight opacity-60">
          {failed ? "prévia expirada — rode fetch_album.py de novo" : "porta de entrada · 30s"}
        </p>
      </div>
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <path d="M2 1.2c0-.9 1-1.5 1.8-1L12 5.2c.8.5.8 1.6 0 2.1L3.8 12.3c-.8.5-1.8-.1-1.8-1V1.2Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="2" y="1" width="3.5" height="12" rx="1" />
      <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
    </svg>
  );
}
