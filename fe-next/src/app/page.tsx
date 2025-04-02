import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar */}
      <NavBar />
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center">
        <h2 className="mb-6 text-4xl font-bold text-neutral-800 md:text-5xl">
          Create and Take Exams Online with Ease
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-600">
          Empowering teachers to create assessments and students to test their knowledge through a
          simple, secure platform.
        </p>
        <div className="space-x-4">
          <button className="rounded-md bg-blue-500 px-6 py-3 text-white transition hover:bg-blue-700">
            <Link href="/dashboard">Get Started</Link>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="text-center text-3xl font-bold text-neutral-800">Why Choose Examify?</h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center">
              <div className="mb-4 text-4xl text-primary">📝</div>
              <h4 className="mb-2 text-xl font-semibold">Easy Test Creation</h4>
              <p className="text-neutral-600">
                Teachers can quickly create exams with our intuitive interface
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="mb-4 text-4xl text-primary">🔒</div>
              <h4 className="mb-2 text-xl font-semibold">Secure Access</h4>
              <p className="text-neutral-600">
                Protected entry with links or passcodes for students
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="mb-4 text-4xl text-primary">📊</div>
              <h4 className="mb-2 text-xl font-semibold">Instant Results</h4>
              <p className="text-neutral-600">Get immediate feedback and detailed analytics</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
