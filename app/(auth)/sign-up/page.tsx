import { SignUpForm } from "../_components/SignUpForm";
import { Boxes } from "lucide-react";
import GetMyCV from "@/components/GetMyCV";
import ThemeToggle from "@/components/ThemeToggle";
import Balatro from "@/components/react-bits/Balatro";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="  hidden lg:block relative">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-2xl font-bold">
          <Boxes className="size-32 shrink-0 hover:rotate-180   transition-transform duration-1000 text-primary animate-pulse" />
        </span>
        <Balatro
          isRotate={false}
          mouseInteraction={true}
          color1="#e78a53"
          color2="#5f8787"
          color3="#000000"
          pixelFilter={2000}
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
