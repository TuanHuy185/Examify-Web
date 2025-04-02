import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-neutral-600">Loading user profile...</p>
      </main>
      <Footer />
    </div>
  );
}
