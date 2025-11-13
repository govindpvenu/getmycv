import CopyButton from "@/app/dashboard/_components/CopyButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import ViewTracker from "./_components/ViewTracker";
import { db } from "@/db/drizzle";
import { container, user } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { Download } from "lucide-react";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { PrivateResumeNotice } from "./_components/private-resume-notice";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  console.log("username:", username);
  console.log("slug:", slug);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  const row = await db
    .select({
      id: container.id,
      title: container.title,
      slug: container.slug,
      isPrivate: container.isPrivate,
      resumeUrl: container.resumeUrl,
      userId: container.userId,
    })
    .from(container)
    .innerJoin(user, eq(user.id, container.userId))
    .where(and(eq(user.username, username), eq(container.slug, slug)))
    .limit(1);
  console.log("row:", row);

  const containerData = row[0];

  if (!containerData) notFound();

  if (containerData?.isPrivate && containerData?.userId !== userId) {
    return <PrivateResumeNotice />;
  }

  const cookieStore = await cookies();
  const viewKey = `viewed_${containerData.id}`;
  const hasViewed = cookieStore.get(viewKey)?.value === "1";

  return (
    <main className="flex h-dvh w-full justify-center items-center  rounded  sm:mx-auto sm:my-16 ">
      <ViewTracker containerId={containerData.id} hasViewed={hasViewed} />
      <iframe
        src={`${containerData.resumeUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
        title="Resume"
        className="h-full w-full max-w-2xl border rounded-md"
      />
      <div className="fixed bottom-5 right-5 z-0 hidden sm:block print:hidden">
        <div className="flex flex-col items-center gap-y-2">
          <CopyButton
            text={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${slug}`}
          />
          <a
            href={`/api/containers/${containerData.id}/download`}
            target="_blank"
            download={`${containerData.title}.pdf`}
          >
            <Button
              size="icon"
              variant="outline"
              className="size-9 rounded-full"
            >
              <Download size={20} />
            </Button>
          </a>

          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}
