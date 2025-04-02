'use client';

import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="text-center">
          <p className="mb-4 text-red-500">Error: {error.message}</p>
          <button
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-secondary"
          >
            Try again
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
