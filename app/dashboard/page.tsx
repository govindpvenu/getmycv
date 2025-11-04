import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { container, containerSchema } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { FileBox, PackagePlus } from "lucide-react";
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
import { containerType } from "@/types/containerTypes";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const username = session?.user.username;
  console.log("username:", username);
  if (!username) redirect("/dashboard/settings#profile");

  const containers = await db
    .select()
    .from(container)
    .where(eq(container.userId, session.user.id));
  console.log("containers: ", containers);

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <ContainerList username={username} containers={containers} />
      </div>
    </div>
  );
}

function ContainerList({
  username,
  containers,
}: {
  username: string;
  containers: containerType[];
}) {
  return (
    <div className="flex flex-row gap-4 border flex-wrap overflow-y-auto">
      <CreateContainerCard />
      {containers.map((container) => (
        <ContainerCard
          key={container.id}
          username={username}
          container={container}
        />
      ))}
    </div>
  );
}

function ContainerCard({
  username,
  container,
}: {
  username: string;
  container: containerType;
}) {
  return (
    <Card className="w-full max-w-xs  h-96 flex justify-center bg-accent items-center ">
      <CardHeader>
        <CardTitle>{container.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <FileBox className="size-16 text-primary" />
        <p>{container.isPrivate ? "Private" : "Public"}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/${username}/${container.slug}`}>View</Link>
        <Link href={container.resumeUrl}>Open</Link>
      </CardFooter>
    </Card>
  );
}

function CreateContainerCard() {
  return (
    <Dialog>
      <DialogTrigger asChild>
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
