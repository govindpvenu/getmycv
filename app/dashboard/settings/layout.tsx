import { SettingsNav } from "./_components/SettingsNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <div className="flex overflow-y-auto h-full w-full flex-1 flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        {children}
      </div>
      <SettingsNav />
    </div>
  );
}
