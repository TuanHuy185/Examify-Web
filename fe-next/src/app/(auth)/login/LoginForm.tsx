'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

interface LoginFormData {
  username: string;
  password: string;
}

interface DecodedToken {
  role: string;
  userId: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BE_API_URL}/api/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.status === 'OK') {
        const decodedToken = jwtDecode<DecodedToken>(data.data);
        const role = decodedToken.role;

        localStorage.setItem('token', data.data);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', decodedToken.userId);

        // Redirect to unified dashboard
        router.push('/dashboard');
      } else if (data.status === 'ERROR') {
        toast.error('Login failed. Please check your information.');
      }
    } catch (error) {
      toast.error('An error occurred while logging in.');
      console.error('Error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-primary hover:text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <h2 className="flex-grow text-center text-2xl font-bold">Login</h2>
        <div className="w-6"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your username"
            required
            suppressHydrationWarning
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              required
              suppressHydrationWarning
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
              suppressHydrationWarning
            >
              {showPassword ? (
                <span className="h-5 w-5">👁️</span>
              ) : (
                <span className="h-5 w-5">👁️‍🗨️</span>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="hover:bg-primary-dark w-full rounded-md bg-primary px-4 py-2 font-medium text-blue-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          suppressHydrationWarning
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="hover:text-primary-dark font-medium text-primary">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
