import { Boxes } from "lucide-react";
import { HyperText } from "./magic-ui/hyper-text";
import Link from "next/link";

export default function GetMyCV() {
  return (
    <Link
      href="/"
      className="relative  z-20 flex items-center space-x-2 py-1 text-xl font-normal text-primary"
    >
      <Boxes className="size-10 shrink-0 hover:rotate-180 transition-transform duration-300 " />

      <HyperText className="text-primary font- from-accent to-primary bg-clip-text text-4xl font-extrabold tracking-tight  animate-gradient-x">
        GetMyCV
      </HyperText>
    </Link>
  );
}
