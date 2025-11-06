import { auth } from "@/lib/auth";
import { SidebarMain } from "./_components/SidebarMain";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  return (
    <div
      className={
        "mx-auto sm:h-screen h-full flex w-full  flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800"
      }
    >
      <SidebarMain user={session.user} />
      {children}
    </div>
  );
}
