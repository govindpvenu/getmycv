import Image from "next/image";
import { SignUpForm } from "../_components/SignUpForm";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import GetMyCV from "@/components/GetMyCV";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          width={100}
          height={100}
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between items-center gap-2 ">
          <GetMyCV />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
