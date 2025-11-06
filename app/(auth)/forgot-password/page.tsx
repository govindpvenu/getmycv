import ForgotPasswordForm from "../_components/ForgotPasswordForm";
import GetMyCV from "@/components/GetMyCV";

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const email = (await searchParams).email || "";

  return (
    <div className="min-h-svh flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <GetMyCV />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <ForgotPasswordForm email={email} />
        </div>
      </div>
    </div>
  );
}
