'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addUser } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import Footer from "@/components/Footer";

interface SignupFormData {
  username: string;
  password: string;
  confirmPassword: string;
  role: 'STUDENT' | 'TEACHER';
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT"
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Enhanced validation
    if (!formData.username || !formData.password) {
      toast.error("Username and password are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Call the API with the user data
    const userData = {
      username: formData.username,
      password: formData.password,
      role: formData.role
    };

    try {
      setIsLoading(true);
      const result = await addUser(userData);

      if (result && result.success) {
        // Navigate to login page after successful signup
        toast.success("Registration successful! Please log in.");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-primary">
            Examify
          </Link>
        </div>
      </header>

      {/* Signup Form */}
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-primary hover:text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h2 className="text-3xl font-bold text-neutral-800 text-center flex-grow">
              Sign Up
            </h2>
            <div className="w-6"></div> {/* Empty div for balanced spacing */}
          </div>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="role"
                className="block text-neutral-600 mb-2 font-medium"
              >
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-center text-neutral-600">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
