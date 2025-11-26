import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { containerType } from "@/types/containerTypes";
import { EditContainerForm } from "./EditContainerForm";

export default function EditButton({
  container,
}: {
  container: containerType;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil size={16} aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <EditContainerForm container={container} />
    </Sheet>
  );
}
