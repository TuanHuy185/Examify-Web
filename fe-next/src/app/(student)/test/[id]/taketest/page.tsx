'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface Question {
  id: number;
  content: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  content: string;
}

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

const StudentTakeTest = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get localStorage values only on client side
    const userId = localStorage.getItem('userId');
    const userToken = localStorage.getItem('token');

    if (!userId || !userToken) {
      setError('User not authenticated');
      router.push('/login');
      return;
    }

    setStudentId(userId);
    setToken(userToken);
  }, [router]);

  // Add a separate useEffect to handle authentication state
  useEffect(() => {
    if (studentId && token) {
      setError(null); // Clear any previous error
    }
  }, [studentId, token]);

  useEffect(() => {
    try {
      const testId = searchParams.get('testId');
      const startTime = searchParams.get('startTime');
      const endTimeISO = searchParams.get('endTimeISO');
      const numberOfQuestion = searchParams.get('numberOfQuestion');

      console.log('URL Parameters:', { testId, startTime, endTimeISO, numberOfQuestion });

      if (testId) {
        // Calculate test time in minutes from start and end time
        const start = new Date(startTime || '');
        const end = new Date(endTimeISO || '');
        const testTimeInMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

        const testInfoData = {
          id: testId,
          title: 'Bài kiểm tra', // You might want to fetch this from the API
          description: '',
          testtime: testTimeInMinutes,
          timeopen: startTime || '',
          timeclose: endTimeISO || '',
          passcode: '',
          numberquestion: parseInt(numberOfQuestion || '0'),
          numberOfQuestion: parseInt(numberOfQuestion || '0'),
        };

        console.log('Constructed test info:', testInfoData);
        setTestInfo(testInfoData);
        setTimeRemaining(testTimeInMinutes * 60);
      } else {
        setError('No test ID available');
      }
    } catch (err) {
      setError('Error processing test data');
      console.error('Error processing test data:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log('Current state - testInfo:', testInfo);
      console.log('Current state - token:', token);

      if (!testInfo?.id || !token) {
        console.log('Cannot fetch questions - missing data:', {
          testInfoId: testInfo?.id,
          hasToken: !!token,
        });
        return;
      }

      try {
        console.log('Fetching questions for test:', testInfo.id);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BE_API_URL}/tests/${testInfo.id}/questions`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        const validQuestions = data.data.filter((q: Question) => q.answers?.length > 0);
        setQuestions(validQuestions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      }
    };

    fetchQuestions();
  }, [testInfo, token]);

  useEffect(() => {
    if (timeRemaining <= 0 && !testSubmitted) {
      handleSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, testSubmitted]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (!studentId || !token) {
      setError('User not authenticated');
      return;
    }

    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);

    try {
      const submissionTime = new Date().toISOString();
      const timeSpent = (testInfo?.testtime || 0) * 60 - timeRemaining;

      const submissionResults = await Promise.allSettled(
        Object.entries(selectedAnswers).map(([questionId, answerId]) =>
          submitAnswer({
            studentId,
            questionId: parseInt(questionId),
            answerId: parseInt(answerId.toString()),
            timeSpent,
            submittedAt: submissionTime,
          })
        )
      );

      const failedSubmissions = submissionResults.filter((r) => r.status === 'rejected');

      if (failedSubmissions.length > 0) {
        saveFailedSubmissions(failedSubmissions);
        throw new Error(
          `Gửi thành công ${submissionResults.length - failedSubmissions.length}/${submissionResults.length} câu trả lời`
        );
      }

      await completeTestSubmission({
        testId: testInfo?.id || '',
        studentId,
        timeSpent,
        submittedAt: submissionTime,
      });
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi nộp bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAnswer = async ({
    studentId,
    questionId,
    answerId,
    timeSpent,
    submittedAt,
  }: {
    studentId: string;
    questionId: number;
    answerId: number;
    timeSpent: number;
    submittedAt: string;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_API_URL}/students/${studentId}/questions/${questionId}/answers/${answerId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Lỗi khi gửi câu ${questionId}`);
    }

    return response.json();
  };

  const completeTestSubmission = async ({
    testId,
    studentId,
    timeSpent,
    submittedAt,
  }: {
    testId: string;
    studentId: string;
    timeSpent: number;
    submittedAt: string;
  }) => {
    setTestSubmitted(true);
  };

  const saveFailedSubmissions = (failedSubmissions: PromiseRejectedResult[]) => {
    const failedAnswers = failedSubmissions.map((f) => ({
      questionId: f.reason.questionId,
      answerId: f.reason.answerId,
      error: f.reason.message,
    }));

    localStorage.setItem(
      'failedAnswers',
      JSON.stringify({
        testId: testInfo?.id,
        answers: failedAnswers,
        timestamp: new Date().toISOString(),
      })
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-50">
        <NavBar isAuthenticated={true} userRole="student" />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-lg text-neutral-600">Đang tải câu hỏi...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !studentId) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-50">
        <NavBar isAuthenticated={true} userRole="student" />
        <main className="flex flex-1 items-center justify-center">
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Đã xảy ra lỗi</h2>
            <p className="mb-6 text-neutral-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (testSubmitted) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-50">
        <NavBar isAuthenticated={true} userRole="student" />
        <main className="flex flex-1 items-center justify-center">
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-green-600">Nộp bài thành công!</h2>
            <p className="mb-6 text-neutral-600">Kết quả sẽ được thông báo sau khi chấm bài.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Về trang chủ
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-50">
        <NavBar isAuthenticated={true} userRole="student" />
        <main className="flex flex-1 items-center justify-center">
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">Không có câu hỏi</h2>
            <p className="mb-6 text-neutral-600">Bài kiểm tra này hiện chưa có câu hỏi.</p>
            <button
              onClick={() => router.push('/student/dashboard')}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Về trang chủ
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <NavBar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-800">
              {testInfo?.title || 'Bài kiểm tra'}
            </h2>
            <div className="rounded bg-red-100 px-3 py-1 text-red-700">
              Thời gian: {formatTime(timeRemaining)}
            </div>
          </div>

          <h3 className="mb-3 font-medium text-neutral-800">Danh sách câu hỏi</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`flex h-10 w-10 items-center justify-center rounded ${
                  currentQuestionIndex === index
                    ? 'bg-blue-500 text-white'
                    : selectedAnswers[q.id]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="mb-6">
            <div className="mb-4 mt-5 flex justify-between">
              <span className="text-sm text-neutral-500">
                Câu {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>

            <h3 className="mb-4 text-lg font-medium text-neutral-800">{currentQuestion.content}</h3>

            <div className="space-y-3">
              {currentQuestion.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`cursor-pointer rounded border p-3 transition-colors ${
                    selectedAnswers[currentQuestion.id] === answer.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-neutral-300 hover:bg-neutral-50'
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                >
                  {answer.content}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`rounded px-4 py-2 ${
                currentQuestionIndex === 0
                  ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Câu trước
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className={`rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 ${
                  isSubmitting ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentTakeTest;
