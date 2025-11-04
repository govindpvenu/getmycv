import { auth } from "@/lib/auth";
import ChangeAvatar from "./_components/ChangeAvatar";
import { headers } from "next/headers";
import {
  BillingSection,
  IntegrationsSection,
  NotificationsSection,
  ProfileSection,
  SecuritySection,
  SettingsPage,
} from "./_components/settings-page";

export default async function Settings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // <ChangeAvatar image={session?.user?.image ?? null} />

  return (
    <div className="">
      <div className="mx-auto max-w-4xl">
        <ProfileSection />
        <SecuritySection />
        <NotificationsSection />
        <BillingSection />
        <IntegrationsSection />
      </div>
    </div>
  );
}
