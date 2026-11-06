export function FichaCardSkeleton() {
  return (
    <div className="w-full max-w-sm animate-pulse overflow-hidden rounded-[28px] bg-brand-plum p-5">
      <div className="aspect-square w-full rounded-[20px] bg-white/10" />
      <div className="mt-5 h-3 w-24 rounded bg-white/10" />
      <div className="mt-3 h-5 w-full rounded bg-white/10" />
      <div className="mt-2 h-5 w-3/4 rounded bg-white/10" />
    </div>
  );
}
