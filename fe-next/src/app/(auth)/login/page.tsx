import Link from "next/link";
import LoginForm from "@/app/(auth)/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-primary">
            Examify
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <LoginForm />
      </main>
    </div>
  );
}