'use client';

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

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
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error.message}</p>
          <button
            onClick={reset}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
          >
            Try again
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 