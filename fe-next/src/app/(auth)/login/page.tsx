import Link from 'next/link';
import LoginForm from '@/app/(auth)/login/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="text-2xl font-bold text-primary">
            Examify
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <LoginForm />
      </main>
    </div>
  );
}
