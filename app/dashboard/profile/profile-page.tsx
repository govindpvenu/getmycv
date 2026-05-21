"use client";

import { useEffect, useState } from "react";
import AccountInfo from "./_components/AccountInfo";
import ProfileDetails from "./_components/ProfileDetails";
import ProfileHeader from "./_components/ProfileHeader";
import type { Session } from "@/lib/auth-client";

export default function ProfilePage({ user }: { user: Session["user"] }) {
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  return (
    <div className="flex flex-1">
      <div className="flex  h-full w-full overflow-y-auto flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="mx-auto max-w-4xl space-y-4  ">
          <div id="profile-info">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-balance">
                User Profile
              </h1>
              <ProfileHeader user={currentUser} />
              <ProfileDetails
                user={currentUser}
                onUserUpdated={setCurrentUser}
              />
              <AccountInfo user={currentUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
