"use client";

import { buttonVariants } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import type { containerType } from "@/types/containerTypes";
import { EditContainerForm } from "./EditContainerForm";

export default function EditButton({
  container,
}: {
  container: containerType;
}) {
  return (
    <Sheet>
      <SheetTrigger
        className={buttonVariants({ variant: "outline", size: "sm" })}
        aria-label="Edit container"
      >
        <Pencil size={16} aria-hidden="true" />
      </SheetTrigger>
      <EditContainerForm container={container} />
    </Sheet>
  );
}
