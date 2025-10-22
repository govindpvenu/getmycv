import { Spinner } from "@/components/kibo-ui/spinner";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner variant="bars" className="size-16 text-primary" />
    </div>
  );
}
