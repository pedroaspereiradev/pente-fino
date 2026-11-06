// Icones copiados exatamente (mesmos paths) dos arquivos em design-ref/*.html.

export function CombIcon({ color = "#1A0F2E" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M3 5h14M5 5v11M8.5 5v11M12 5v11M15.5 5v11"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M14 9H4M8 5L4 9l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="4" r="1.4" fill="currentColor" />
      <circle cx="9" cy="9" r="1.4" fill="currentColor" />
      <circle cx="9" cy="14" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M9 15s-6-3.6-6-8a3.2 3.2 0 0 1 6-1.6A3.2 3.2 0 0 1 15 7c0 4.4-6 8-6 8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RepeatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M4 8a5 5 0 0 1 9-2.5M14 10a5 5 0 0 1-9 2.5M13 2.5v3h-3M5 15.5v-3h3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BigPlayIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6 4v12l10-6z" fill={color} />
    </svg>
  );
}

export function BigPauseIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect x="5" y="4" width="3.5" height="12" rx="1" fill={color} />
      <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill={color} />
    </svg>
  );
}

export function ExternalLinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M7 4H4v10h10v-3M10 3h5v5M15 3l-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6 3l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M4 9h10M10 5l4 4-4 4"
        fill="none"
        stroke="#050507"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
