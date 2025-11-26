"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function PreviewModalWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  function onOpenChange(open: boolean) {
    if (!open) {
      router.back();
    }
  }
  function onOpen() {
    window.location.reload();
  }
  return (
    <Dialog onOpenChange={onOpenChange} defaultOpen={true}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden">
        {children}
        <DialogTitle className="hidden"></DialogTitle>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button onClick={onOpen} type="button">
            Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
