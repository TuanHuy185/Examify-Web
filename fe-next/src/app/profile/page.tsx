'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo, selectUser } from '@/store/slices/userSlice';
import { AppDispatch } from '@/store/store';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

const UserProfile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, loading, error } = useSelector(selectUser);

  useEffect(() => {
    // Get userId from localStorage only on client side
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserInfo(userId));
    }
  }, [dispatch, userId]);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-neutral-600">No user information available.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const userInitial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* User Profile Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-neutral-800">User Profile</h2>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-neutral-600">
                  <strong>Name:</strong> {userInfo.name || 'Not available'}
                </p>
                <p className="mb-4 text-neutral-600">
                  <strong>Email:</strong> {userInfo.email || 'Not available'}
                </p>
                <p className="text-neutral-600">
                  <strong>Date of Birth:</strong> {userInfo.date_of_birth || 'Not available'}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-neutral-600">
                  <span className="text-2xl">{userInitial}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
