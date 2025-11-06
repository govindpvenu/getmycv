import { GalleryVerticalEnd } from "lucide-react";
import { ResetPasswordForm } from "../_components/ResetPassword";
import Link from "next/link";
import GetMyCV from "@/components/GetMyCV";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const token = (await searchParams).token;

  if (!token) {
    return (
      <div className="min-h-svh flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <GetMyCV />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">Invalid token</div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-svh flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <GetMyCV />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}
