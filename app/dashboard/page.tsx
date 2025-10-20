export default function DashboardPage() {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <CreateContainerCard />
      </div>
    </div>
  );
}

import { PackagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateContainerForm } from "./_components/CreateContainerForm";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
function CreateContainerCard() {
  return (
    <Dialog>
      <DialogTrigger>
        <Card className="w-full max-w-xs  h-96 flex justify-center bg-accent items-center ">
          <CardContent>
            <PackagePlus className="size-16 text-primary" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new container</DialogTitle>
          <DialogDescription>
            Upload you resume to manage and track you resume.
          </DialogDescription>
        </DialogHeader>
        <CreateContainerForm />
      </DialogContent>
    </Dialog>
  );
}
