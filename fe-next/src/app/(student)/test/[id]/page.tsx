'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface TestInfo {
  id: string;
  title: string;
  description: string;
  testtime: number;
  timeopen: string;
  timeclose: string;
  passcode: string;
  numberquestion: number;
  numberOfQuestion: number;
}

const StudentTest = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const testData = searchParams.get('testData');
      console.log(testData);
      if (testData) {
        const parsedData = JSON.parse(decodeURIComponent(testData));
        setTestInfo(parsedData);
      } else {
        setError('No test data available');
      }
    } catch (err) {
      setError('Error parsing test data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleStartTest = async () => {
    if (!testInfo) return;

    const studentId = localStorage.getItem('userId');
    if (!studentId) {
      console.error('No student ID found');
      return;
    }

    const startTimea = new Date();
    if (isNaN(startTimea.getTime())) {
      console.error('startTimea is invalid');
      return;
    }

    const testTime = testInfo.testtime;
    if (typeof testTime !== 'number' || isNaN(testTime)) {
      console.error('testTime is not a valid number:', testTime);
      return;
    }

    const endTime = new Date(startTimea.getTime() + testTime * 60000);
    if (isNaN(endTime.getTime())) {
      console.error('endTime is invalid');
      return;
    }

    const startTime = startTimea.toISOString();
    const endTimeISO = endTime.toISOString();

    try {
      const token = localStorage.getItem('token');

      // First check if student has already taken this test
      const checkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BE_API_URL}/students/${studentId}/results`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      if (!checkResponse.ok) {
        throw new Error('Không thể kiểm tra lịch sử bài kiểm tra.');
      }

      const results = await checkResponse.json();
      const hasTakenTest = results.data.some(
        (result: any) => result.testid === parseInt(testInfo.id)
      );

      if (hasTakenTest) {
        alert('Bạn đã làm bài kiểm tra này trước đó. Không thể làm lại bài kiểm tra.');
        return;
      }

      // If not taken, proceed with starting the test
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_API_URL}/students/${studentId}/results`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            studentId: parseInt(studentId),
            testId: parseInt(testInfo.id),
            startTime: startTime,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể bắt đầu bài kiểm tra.');
      }
      console.log('Bài kiểm tra đã bắt đầu thành công.');
      router.push(
        `/test/${testInfo.id}/taketest?testId=${testInfo.id}&startTime=${startTime}&endTimeISO=${endTimeISO}&numberOfQuestion=${testInfo.numberquestion}`
      );
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu bắt đầu bài kiểm tra:', error);
      alert('Có lỗi xảy ra khi bắt đầu bài kiểm tra. Vui lòng thử lại sau.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-neutral-600">Loading test information...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-red-500">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!testInfo) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-red-500">
            No test information available. Please enter a valid passcode.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar isAuthenticated={true} userRole="student" onLogout={() => router.push('/login')} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-neutral-800">Test Information</h2>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-neutral-600">Title</label>
                <input
                  type="text"
                  value={testInfo.title}
                  disabled
                  className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-3 py-2 text-neutral-600"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-neutral-600">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={testInfo.testtime}
                  disabled
                  className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-3 py-2 text-neutral-600"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-neutral-600">Time Open</label>
                <input
                  type="text"
                  value={new Date(testInfo.timeopen).toLocaleString()}
                  disabled
                  className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-3 py-2 text-neutral-600"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-neutral-600">Time Close</label>
                <input
                  type="text"
                  value={new Date(testInfo.timeclose).toLocaleString()}
                  disabled
                  className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-3 py-2 text-neutral-600"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-neutral-600">Passcode</label>
                <input
                  type="text"
                  value={testInfo.passcode}
                  disabled
                  className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-3 py-2 text-neutral-600"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-neutral-600">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={testInfo.numberquestion}
                  disabled
                  className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-3 py-2 text-neutral-600"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="mb-2 block font-medium text-neutral-600">Description</label>
              <textarea
                value={testInfo.description}
                disabled
                className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-3 py-2 text-neutral-600"
                rows={4}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleStartTest}
                className="rounded-md bg-primary px-6 py-2 text-white transition hover:bg-green-700"
              >
                Take Test
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudentTest;
