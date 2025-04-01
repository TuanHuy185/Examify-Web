'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeacherTests,
  selectTeacherTests,
} from "@/store/slices/teacherTestSlice";
import { fetchPastTestResults, selectStudentTests } from "@/store/slices/studentTestSlice";
import { AppDispatch } from "@/store/store";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";
import { Test, TestResult } from "@/types/slices";

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { tests: teacherTests, loading: teacherLoading, error: teacherError } = useSelector(selectTeacherTests);
  const { pastResults, loading: studentLoading, error: studentError } = useSelector(selectStudentTests);
  const [searchQuery, setSearchQuery] = useState("");
  const [passcode, setPasscode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");
    
    if (userId && role) {
      const normalizedRole = role.toLowerCase();
      setUserRole(normalizedRole as 'student' | 'teacher');
      if (normalizedRole === 'teacher') {
        dispatch(fetchTeacherTests(userId));
      } else if (normalizedRole === 'student') {
        dispatch(fetchPastTestResults(userId));
      }
    }
  }, [dispatch]);

  const handleCreateTest = () => {
    router.push("/create-test");
  };

  const handleViewResults = (testId: string) => {
    router.push(`/results/${testId}`);
  };

  const handleViewDetails = (testId: string) => {
    router.push(`/detail-test/${testId}`);
  };

  const handleJoinTest = async () => {
    setJoinLoading(true);
    setJoinError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BE_API_URL}/students/tests?passcode=${passcode}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok && result.status === "OK" && result.data) {
        router.push(`/student/test/${passcode}`);
      } else {
        setJoinError("There is no test matches the passcode.");
      }
    } catch (err) {
      setJoinError("An error occurred while fetching test info. Please try again.");
    } finally {
      setJoinLoading(false);
    }
  };

  // Filter tests based on search query
  const filteredTests = userRole === 'teacher' 
    ? (searchQuery.trim() === ""
      ? teacherTests
      : teacherTests.filter((test) => {
          const query = searchQuery.toLowerCase();
          return (
            test.title.toLowerCase().includes(query) ||
            test.passcode?.toLowerCase().includes(query) 
          );
        }))
    : (searchQuery.trim() === ''
      ? pastResults 
      : pastResults.filter(result => 
          result.id.toLowerCase().includes(searchQuery.toLowerCase())
        ));

  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Welcome, {userRole === 'teacher' ? 'Teacher' : 'Student'}
          </h2>
          <p className="text-neutral-600">
            {userRole === 'teacher' 
              ? 'Manage your tests and view student results'
              : 'Enter a passcode to join a test or view your past results.'}
          </p>
        </section>

        {/* Create Test Section (Teacher only) */}
        {userRole === 'teacher' && (
          <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
              Create New Test
            </h3>
            <button
              onClick={handleCreateTest}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Test
            </button>
          </section>
        )}

        {/* Join Test Section (Student only) */}
        {userRole === 'student' && (
          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
              Enter Code to Join Test
            </h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setJoinError("");
                  }}
                  placeholder="Enter passcode"
                  className="flex-grow px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={joinLoading}
                />
                <button
                  onClick={handleJoinTest}
                  disabled={joinLoading}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition disabled:bg-gray-400"
                >
                  {joinLoading ? "Loading..." : "Visit Test"}
                </button>
              </div>
              {joinError && <p className="text-red-500 mt-2">{joinError}</p>}
            </div>
          </section>
        )}

        {/* Tests/Results Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-neutral-800">
              {userRole === 'teacher' ? 'Your Tests' : 'Your Past Results'}
            </h3>

            {/* Search bar for filtering tests */}
            <div className="relative w-1/3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search by ${userRole === 'teacher' ? 'title or passcode' : 'test name'}...`}
                className="w-full px-3 py-2 pl-10 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search
                size={18}
                className="text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>

          {userRole === 'teacher' ? (
            teacherLoading ? (
              <p className="text-neutral-600">Loading tests...</p>
            ) : teacherError ? (
              <p className="text-red-500">Error: {teacherError}</p>
            ) : teacherTests.length === 0 ? (
              <p className="text-neutral-600">No tests found.</p>
            ) : filteredTests.length === 0 ? (
              <p className="text-neutral-600 bg-white p-4 rounded-lg shadow-md text-center">
                No tests match your search criteria.
              </p>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-accent">
                    <tr>
                      <th className="text-left p-4 text-neutral-800">Title</th>
                      <th className="text-left p-4 text-neutral-800">Passcode</th>
                      <th className="text-left p-4 text-neutral-800">Duration</th>
                      <th className="text-left p-4 text-neutral-800">Time Open</th>
                      <th className="text-left p-4 text-neutral-800">Time Close</th>
                      <th className="text-left p-4 text-neutral-800">Details</th>
                      <th className="text-left p-4 text-neutral-800">Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredTests as Test[]).map((test) => (
                      <tr
                        key={test.id}
                        className="border-t border-neutral-600 hover:bg-accent"
                      >
                        <td className="p-4 text-neutral-600">{test.title}</td>
                        <td className="p-4 text-neutral-600">{test.passcode}</td>
                        <td className="p-4 text-neutral-600">{test.testtime} min</td>
                        <td className="p-4 text-neutral-600">
                          {new Date(test.timeopen).toLocaleString()}
                        </td>
                        <td className="p-4 text-neutral-600">
                          {new Date(test.timeclose).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleViewDetails(test.id || "")}
                            className="text-primary hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleViewResults(test.id || "")}
                            className="text-primary hover:underline"
                          >
                            View Results
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            studentLoading ? (
              <p className="p-4 text-neutral-600">Loading past results...</p>
            ) : studentError ? (
              <p className="p-4 text-red-500">Error: {studentError}</p>
            ) : pastResults.length === 0 ? (
              <p className="p-4 text-neutral-600 text-center">No past results available.</p>
            ) : filteredTests.length === 0 ? (
              <p className="p-4 text-neutral-600 text-center">No tests match your search.</p>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-accent">
                    <tr>
                      <th className="text-left p-4 text-neutral-800">Test Title</th>
                      <th className="text-left p-4 text-neutral-800">Total Score</th>
                      <th className="text-left p-4 text-neutral-800">Start Time</th>
                      <th className="text-left p-4 text-neutral-800">End Time</th>
                      <th className="text-left p-4 text-neutral-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredTests as TestResult[]).map((result) => (
                      <tr
                        key={result.id}
                        className="border-t border-neutral-600 hover:bg-accent"
                      >
                        <td className="p-4 text-neutral-600">Test {result.id}</td>
                        <td className="p-4 text-neutral-600">{result.score}</td>
                        <td className="p-4 text-neutral-600">
                          {new Date(result.submittedAt).toLocaleString()}
                        </td>
                        <td className="p-4 text-neutral-600">
                          {new Date(result.submittedAt).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleViewDetails(result.id)}
                            className="text-primary hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard; 