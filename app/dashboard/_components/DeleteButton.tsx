"use client";

import { useState } from "react";
import { CircleAlertIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import { deleteContainerAction } from "@/actions/container-actions";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  containerId,
  containerSlug,
}: {
  containerId: string;
  containerSlug: string;
}) {
  const [inputValue, setInputValue] = useState(containerSlug);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { executeAsync, isExecuting, hasSucceeded } = useAction(
    deleteContainerAction,
    {
      onSuccess: () => {
        toast.success("Container deleted successfully");
        setIsOpen(false);
        router.refresh();
      },
      onError: () => {
        toast.error("Failed to delete container");
      },
    },
  );
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 size={16} aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-md">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Confirm deletion
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              This will delete the container and all associated statistics.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5">
          <div className="*:not-first:mt-2">
            <Label>To confirm, type “{containerSlug}”</Label>
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() => executeAsync({ containerId })}
              className="flex-1"
              disabled={
                inputValue !== containerSlug || isExecuting || hasSucceeded
              }
            >
              {isExecuting ? <Spinner /> : hasSucceeded ? "Deleted" : "Delete"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
