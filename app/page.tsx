import { LoginForm } from "@/components/LoginForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ThemeToggle />
      <LoginForm />
    </div>
  );
}
