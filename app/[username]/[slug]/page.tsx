import CopyButton from "@/app/dashboard/_components/CopyButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { db } from "@/db/drizzle";
import { container, user } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  console.log("username:", username);
  console.log("slug:", slug);

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
  console.log("containeData::", containerData);

  if (!containerData) notFound();

  if (containerData?.isPrivate) {
    return <div>Resume is private</div>;
  }
  return (
    <main className="flex h-dvh w-full justify-center items-center  rounded  sm:mx-auto sm:my-16 ">
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
            href={`${containerData.resumeUrl}?download=1`}
            target="_blank"
            download={`${containerData.title}.pdf`}
            rel="noopener noreferrer"
          >
            <Button
              size="icon"
              className="hover:bg-muted size-9  rounded-full"
              variant="outline"
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
