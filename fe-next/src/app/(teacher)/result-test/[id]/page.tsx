'use client';

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchTestResults, selectTeacherTests } from "@/store/slices/teacherTestSlice";
import { TeacherTestState, TestResult } from "@/types/slices";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const ViewResults = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { allTestResults, loading, error } = useSelector(selectTeacherTests) as TeacherTestState;
  const testId = params.id as string;
  const title = params.title as string;

  useEffect(() => {
    if (testId) {
      dispatch(fetchTestResults(testId));
    }
    console.log(allTestResults);
  }, [dispatch, testId]);

  const handleViewDetails = (testId: string, studentId: string) => {
    router.push(`/test/${testId}/students/${studentId}`);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* NavBar */}
      <NavBar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleGoBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Go back"
          >
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h2 className="text-3xl font-bold text-neutral-800">Results</h2>
        </div>
        
        {/* Results Section */}
        <section>
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Result of {title}
          </h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <p className="p-4 text-neutral-600">Loading results...</p>
            ) : error ? (
              <p className="p-4 text-red-500">Error: {error}</p>
            ) : !allTestResults || allTestResults.length === 0 ? (
              <p className="p-4 text-neutral-600 text-center">No results available.</p>
            ) : (
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left p-4 text-neutral-800">Student Name</th>
                    <th className="text-left p-4 text-neutral-800">Score</th>
                    <th className="text-left p-4 text-neutral-800">Start Time</th>
                    <th className="text-left p-4 text-neutral-800">End Time</th>
                    <th className="text-left p-4 text-neutral-800">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allTestResults.map((result: TestResult) => (
                    <tr
                      key={result.studentId}
                      className="border-t border-neutral-600 hover:bg-accent"
                    >
                      <td className="p-4 text-neutral-600">{result.studentName}</td>
                      <td className="p-4 text-neutral-600">{result.totalScore}</td>
                      <td className="p-4 text-neutral-600">
                        {new Date(result.startTime).toLocaleString()}
                      </td>
                      <td className="p-4 text-neutral-600">
                        {new Date(result.endTime).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewDetails(testId, result.studentID)}
                          className="text-primary hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ViewResults;