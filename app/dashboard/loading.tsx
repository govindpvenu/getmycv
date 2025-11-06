import { Spinner } from "@/components/kibo-ui/spinner";

export default function Loading() {
  return (
    <div className="flex  w-full sm:h-full h-screen">
      <div className="flex h-full justify-center items-center w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <Spinner variant="infinite" className="size-10 text-primary" />
      </div>
    </div>
  );
}
