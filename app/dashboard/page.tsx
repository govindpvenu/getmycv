import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { container } from "@/db/schemas/container-schema";
import { eq } from "drizzle-orm";
import {
  ChartArea,
  Earth,
  FileBox,
  FileText,
  LockKeyhole,
  PackagePlus,
  Plus,
  ShieldCheck,
  SquareArrowOutUpRightIcon,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateContainerForm } from "./_components/CreateContainerForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { containerType } from "@/types/containerTypes";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Suspense, type ReactNode } from "react";
import DeleteButton from "./_components/DeleteButton";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import EditButton from "./_components/EditButton";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const username = session?.user.username;
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
  const containerCount = containers.length;
  const publicCount = containers.filter((item) => !item.isPrivate).length;
  const privateCount = containerCount - publicCount;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-lg border bg-background p-5 shadow-sm md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                Resume containers
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Create shareable resume links, keep drafts private, and track
                how each version performs.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm md:min-w-sm">
            <DashboardStat label="Total" value={containerCount} />
            <DashboardStat label="Public" value={publicCount} />
            <DashboardStat label="Private" value={privateCount} />
          </div>
        </section>

        {containerCount === 0 ? (
          <EmptyDashboard username={username} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <CreateContainerCard username={username} />

            {containers.map((container) => (
              <ContainerCard
                key={container.id}
                username={username}
                container={container}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContainerListSkeleton() {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <ContainerCardSkeleton />
        <ContainerCardSkeleton />
        <ContainerCardSkeleton />
        <ContainerCardSkeleton />
      </div>
    </div>
  );
}

function ContainerCardSkeleton() {
  return (
    <div className="h-80 w-full p-0">
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
    <Card className="group flex h-80 w-full justify-between overflow-hidden bg-background py-2 transition-all duration-300 hover:border-primary hover:shadow-md">
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
            asChild
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          >
            <Link prefetch={true} href={`/${username}/${container.slug}`}>
              Preview
            </Link>
          </Button>
          <Button
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            variant="outline"
            size="sm"
            aria-label="Open link"
            asChild
          >
            <Link target="_blank" href={`/${username}/${container.slug}`}>
              <SquareArrowOutUpRightIcon size={16} aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <ShareButton
          link={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${container.slug}`}
        />
        <EditButton container={container} />
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
      <DrawerTrigger
        className={buttonVariants({ variant: "secondary", size: "sm" })}
        aria-label="View container statistics"
      >
        <ChartArea className="text-white" size={16} aria-hidden="true" />
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

function CreateContainerCard({ username }: { username: string }) {
  return (
    <Dialog>
      <DialogTrigger
        className="group flex h-80 w-full flex-col justify-between rounded-lg border border-dashed border-primary/70 bg-primary/5 p-5 text-left text-card-foreground shadow-sm transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
        aria-label="Create a new container"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <PackagePlus className="size-5" />
          </span>
          <span className="flex size-8 items-center justify-center rounded-full border bg-background text-primary transition-transform group-hover:scale-105">
            <Plus className="size-4" />
          </span>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">
              Create resume container
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Upload a PDF, choose a public link, and start tracking views and
              downloads.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">PDF upload</Badge>
            <Badge variant="outline">Private by default</Badge>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] gap-3 overflow-y-auto p-4 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a new container</DialogTitle>
          <DialogDescription>
            Add your resume and set its share link.
          </DialogDescription>
        </DialogHeader>
        <CreateContainerForm username={username} />
      </DialogContent>
    </Dialog>
  );
}

function DashboardStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function EmptyDashboard({ username }: { username: string }) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="rounded-lg border bg-background p-6 shadow-sm">
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
            <FileText className="size-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Set up your first resume link
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              New workspaces start empty. Create a container for each resume
              version, role, or campaign so every shared link has its own access
              setting and analytics.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <EmptyDashboardItem
              icon={<FileText className="size-4" />}
              title="Upload PDF"
              description="Add the resume file you want to share."
            />
            <EmptyDashboardItem
              icon={<ShieldCheck className="size-4" />}
              title="Control access"
              description="Keep it private until the link is ready."
            />
            <EmptyDashboardItem
              icon={<TrendingUp className="size-4" />}
              title="Track activity"
              description="Review views and downloads per container."
            />
          </div>
        </div>
      </div>
      <CreateContainerCard username={username} />
    </section>
  );
}

function EmptyDashboardItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-background text-primary shadow-xs">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
