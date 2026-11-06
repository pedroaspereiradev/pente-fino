import { FichaCardSkeleton } from "@/components/FichaCardSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <FichaCardSkeleton />
    </div>
  );
}
