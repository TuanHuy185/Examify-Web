'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, selectUser } from "@/store/slices/userSlice";
import { AppDispatch } from "@/store/store";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

const UserProfile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, loading, error } = useSelector(selectUser);

  useEffect(() => {
    // Get userId from localStorage only on client side
    const storedUserId = localStorage.getItem("userId");
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
        <main className="max-w-7xl mx-auto px-4 py-8">
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Profile Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            User Profile
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-neutral-600 mb-4">
                  <strong>Name:</strong> {userInfo.name || 'Not available'}
                </p>
                <p className="text-neutral-600 mb-4">
                  <strong>Email:</strong> {userInfo.email || 'Not available'}
                </p>
                <p className="text-neutral-600">
                  <strong>Date of Birth:</strong> {userInfo.date_of_birth || 'Not available'}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-neutral-600">
                  <span className="text-2xl">
                    {userInitial}
                  </span>
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