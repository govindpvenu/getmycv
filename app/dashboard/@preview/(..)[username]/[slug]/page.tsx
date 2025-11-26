import { db } from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { container, user } from "@/db/schemas";
import PreviewModalWrapper from "../PreviewModalWrapper";
import { Suspense } from "react";
import {
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ResumePreview({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  console.log("intercepting route..");

  const { username, slug } = await params;

  return (
    <PreviewModalWrapper>
      <Suspense fallback={<PreviewModalContentSkeleton />}>
        <PreviewModalContent username={username} slug={slug} />
      </Suspense>
    </PreviewModalWrapper>
  );
}

async function PreviewModalContent({
  username,
  slug,
}: {
  username: string;
  slug: string;
}) {
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

  return (
    <div className="overflow-y-auto">
      <DialogHeader className="contents space-y-0 text-left">
        {/* <DialogTitle className="px-6 pt-6 text-base">
          {containerData.title}
        </DialogTitle> */}
        <DialogDescription asChild>
          <div className="p-6">
            <iframe
              src={`${containerData.resumeUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              title="Resume"
              className=" h-[600px] w-full max-w-2xl border rounded-md"
            />
          </div>
        </DialogDescription>
      </DialogHeader>
    </div>
  );
}

function PreviewModalContentSkeleton() {
  return (
    <div className="overflow-y-auto">
      <div className="p-6">
        <Skeleton className="h-[600px] w-full max-w-2xl border rounded-md  " />
      </div>
    </div>
  );
}
