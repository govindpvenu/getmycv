import { db } from "@/db/drizzle";
import { container, user } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
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
    <>
      <div>ResumePage: {containerData?.title}</div>
      <div>Resume url: {containerData?.resumeUrl}</div>
      <div>{JSON.stringify(containerData)}</div>
    </>
  );
}
