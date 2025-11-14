import { Spinner } from "@/components/kibo-ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Spinner variant="ring" className="size-32 text-primary" />
    </div>
  );
}
