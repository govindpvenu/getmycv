import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { container, containerSchema } from "@/db/schemas";
import { eq } from "drizzle-orm";
import {
  Earth,
  FileBox,
  LockKeyhole,
  MoreVertical,
  PackagePlus,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { getRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const username = session?.user.username;
  console.log("username:", username);
  if (!username) redirect("/dashboard/profile");

  const containers = await db
    .select()
    .from(container)
    .where(eq(container.userId, session.user.id));
  console.log("containers: ", containers);

  return (
    <div className="flex flex-1 ">
      <div className="flex  h-full w-full  flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white  dark:border-neutral-700 dark:bg-neutral-900">
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
    <div className="flex  flex-row gap-4 justify-center items-center sm:justify-start sm:items-start flex-wrap p-2 md:p-10 overflow-y-auto h-full">
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
    <Card className="w-full max-w-xs h-96 py-2 flex bg-accent items-center justify-between hover:border-primary transition-all duration-300 group">
      <CardHeader className="w-full px-4  flex flex-col justify-between items-start">
        <CardTitle className=" text-lg font-bold text-primary">
          {container.title}
        </CardTitle>
        <CardDescription className="flex w-full items-center justify-between ">
          <span className="text-xs text-muted-foreground">
            Last updated {getRelativeTime(container.updatedAt)}
          </span>
          <div className="flex items-center justify-end gap-2  ">
            {container.isPrivate ? (
              <Badge variant="secondary" className="border-primary/80">
                <LockKeyhole className="size-2 text-primary" />
                <span className="text-xs">Private</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="border-primary/80">
                <Earth className="size-2 text-primary " />
                <span className="text-xs">Public</span>
              </Badge>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileBox className="size-16 text-primary transition-all duration-300 group-hover:scale-105" />
      </CardContent>
      {/* <Link href={`/${username}/${container.slug}`}>View</Link>
      <Link href={container.resumeUrl}>Open</Link> */}
      <CardFooter className="flex w-full justify-between items-center px-4">
        <Button size="sm" className="flex-1 mr-1">
          Preview
        </Button>
        <Button variant="secondary" size="sm" className="flex-1 mx-1">
          Open
        </Button>
        <Button variant="outline" size="sm" className="flex-1 mx-1">
          Share
        </Button>
        <Button variant="default" size="icon" className="ml-1">
          <MoreVertical className="size-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function CreateContainerCard() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-full max-w-xs   hover:border-primary transition-all duration-300 group h-96 flex justify-center bg-accent items-center ">
          <CardContent>
            <PackagePlus className="size-16 text-primary transition-all duration-300 group-hover:scale-105" />
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
