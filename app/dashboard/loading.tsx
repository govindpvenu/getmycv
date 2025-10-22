import { Spinner } from "@/components/kibo-ui/spinner";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner variant="infinite" className="size-10 text-primary" />
    </div>
  );
}
