export function FichaCardSkeleton() {
  return (
    <div
      className="w-full animate-pulse"
      style={{ maxWidth: 390, padding: 20, display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div className="flex items-center justify-between">
        <div className="h-11 w-11 rounded-full bg-white/10" />
        <div className="h-3 w-20 rounded bg-white/10" />
        <div className="h-11 w-11 rounded-full bg-white/10" />
      </div>
      <div style={{ height: 330, borderRadius: 32 }} className="bg-white/10" />
      <div className="h-6 w-full rounded bg-white/10" />
      <div className="h-6 w-2/3 rounded bg-white/10" />
      <div className="h-24 w-full rounded-[24px] bg-white/10" />
    </div>
  );
}
