import { db } from "@/db/drizzle";
import { container } from "@/db/schemas";
import { eq } from "drizzle-orm";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  console.log("username:", username);

  const containerData = await db.query.container.findFirst({
    where: eq(container.slug, slug),
  });
  console.log("containeData::", containerData);
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
