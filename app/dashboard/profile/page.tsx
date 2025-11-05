import AccountInfo from "./_components/AccountInfo";
import { redirect } from "next/navigation";
import ProfileDetails from "./_components/ProfileDetails";
import ProfileHeader from "./_components/ProfileHeader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return (
    <div className="flex flex-1">
      <div className="flex  h-full w-full overflow-y-auto flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="mx-auto max-w-4xl space-y-4  ">
          <div id="profile-info">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-balance">
                User Profile
              </h1>
              <ProfileHeader user={session.user} />
              <ProfileDetails user={session.user} />
              <AccountInfo user={session.user} />
              <AccountInfo user={session.user} />
              <AccountInfo user={session.user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
