import ThemeToggle from "@/components/ThemeToggle";
import GetMyCV from "@/components/GetMyCV";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <GetMyCV />
      <Link href="/sign-in">Sign In</Link>
      <Link href="/sign-up">Sign Up</Link>
      <Link href="/dashboard">Dashboard</Link>
      <ThemeToggle />
    </div>
  );
}
