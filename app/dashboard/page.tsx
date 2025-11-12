import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { container, containerEvent, containerSchema } from "@/db/schemas";
import { eq } from "drizzle-orm";
import {
  ChartArea,
  Download,
  Earth,
  FileBox,
  Info,
  LockKeyhole,
  MoreVertical,
  PackagePlus,
  Pencil,
  SquareArrowOutUpRightIcon,
  Trash2,
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
import ShareButton from "./_components/ShareButton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PartialLineChart } from "@/components/evil-charts/PartialLineChart";
import { getContainerMonthlyStats } from "@/db/data";
import { Suspense } from "react";
import DeleteButton from "./_components/DeleteButton";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("session:", session);

  if (!session) redirect("/sign-in");

  const username = session?.user.username;
  console.log("username:", username);
  if (!username) redirect("/dashboard/profile");

  return (
    <div className="flex flex-1 ">
      <div className="flex  h-full w-full  flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white  dark:border-neutral-700 dark:bg-neutral-900">
        <Suspense fallback={<ContainerListSkeleton />}>
          <ContainerList username={username} userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}

async function ContainerList({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) {
  const containers = await db
    .select()
    .from(container)
    .where(eq(container.userId, userId));
  console.log("containers: ", containers);
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

function ContainerListSkeleton({}: {}) {
  return (
    <div className="flex  flex-row gap-4 justify-center items-center sm:justify-start sm:items-start flex-wrap p-2 md:p-10 overflow-y-auto h-full">
      <CreateContainerCard />

      <ContainerCardSkeleton />
      <ContainerCardSkeleton />
      <ContainerCardSkeleton />
    </div>
  );
}

function ContainerCardSkeleton() {
  return (
    <div className="w-full max-w-xs h-96 p-0 flex items-center justify-between hover:border-primary transition-all duration-300 group">
      <Skeleton className="w-full h-full border" />
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
      <CardFooter className="flex w-full justify-between items-center px-2 ">
        <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
          <Button
            size="sm"
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          >
            <Link href={`/${username}/${container.slug}`}>Preview</Link>
          </Button>
          <Button
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            variant="outline"
            size="sm"
            aria-label="Open link"
          >
            <Link target="_blank" href={`/${username}/${container.slug}`}>
              <SquareArrowOutUpRightIcon size={16} aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <ShareButton
          link={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${container.slug}`}
        />
        <Button variant="outline" size="sm">
          <Pencil size={16} aria-hidden="true" />
        </Button>
        <DeleteButton
          containerId={container.id}
          containerSlug={container.slug}
        />

        <ContainerStatsDrawer containerId={container.id} />
      </CardFooter>
    </Card>
  );
}

function ContainerStatsDrawer({ containerId }: { containerId: string }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm">
          <ChartArea className="text-white" size={16} aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Container Statistics</DrawerTitle>
          <DrawerDescription>
            Total views and downloads of your resume by year.
          </DrawerDescription>
        </DrawerHeader>
        <Suspense fallback={<Spinner />}>
          <div className="flex justify-center items-center ">
            <ContainerStats containerId={containerId} />
          </div>
        </Suspense>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

async function ContainerStats({ containerId }: { containerId: string }) {
  const chartData = await getContainerMonthlyStats(containerId);
  // console.log("chartData:", chartData);
  return (
    <div className="max-w-xl  w-full">
      <PartialLineChart chartData={chartData} />
    </div>
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
