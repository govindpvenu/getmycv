import ThemeToggle from "@/components/ThemeToggle";
import { HyperText } from "@/components/ui/hyper-text";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <HyperText className="text-primary font- from-accent to-primary bg-clip-text text-4xl font-extrabold tracking-tight  animate-gradient-x">
        GetMyCV
      </HyperText>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/sign-up">Sign Up</Link>
      <Link href="/dashboard">Dashboard</Link>
      <ThemeToggle />
    </div>
  );
}
