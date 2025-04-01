import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar */}
      <NavBar />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto pt-20 pb-16 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
          Create and Take Exams Online with Ease
        </h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          Empowering teachers to create assessments and students to test their
          knowledge through a simple, secure platform.
        </p>
        <div className="space-x-4">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            <Link href="/dashboard">
            Get Started
            </Link>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-neutral-800 text-center">
            Why Choose Examify?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-primary text-4xl mb-4">📝</div>
              <h4 className="text-xl font-semibold mb-2">Easy Test Creation</h4>
              <p className="text-neutral-600">
                Teachers can quickly create exams with our intuitive interface
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-primary text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-semibold mb-2">Secure Access</h4>
              <p className="text-neutral-600">
                Protected entry with links or passcodes for students
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-primary text-4xl mb-4">📊</div>
              <h4 className="text-xl font-semibold mb-2">Instant Results</h4>
              <p className="text-neutral-600">
                Get immediate feedback and detailed analytics
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;