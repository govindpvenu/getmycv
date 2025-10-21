import { auth } from "@/lib/auth";
import ChangeAvatar from "./_components/ChangeAvatar";
import { headers } from "next/headers";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <ChangeAvatar image={session?.user?.image ?? null} />
    </div>
  );
}
