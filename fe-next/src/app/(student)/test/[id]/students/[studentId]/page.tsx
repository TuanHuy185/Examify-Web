'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubmissionDetails, selectSubmissions } from '@/store/slices/submissionSlice';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ArrowLeft, Check, X } from 'lucide-react';
import { TestResult, SubmissionState } from '@/types/slices';
import { AppDispatch } from '@/store/store';

interface Question {
  id: string;
  content: string;
  score: number;
  iscorrect: boolean;
  answerid: string;
  answers: {
    id: string;
    content: string;
    iscorrect: boolean;
  }[];
}

interface Submission {
  testid: number;
  title: string;
  description: string;
  numberquestion: number;
  passcode: string;
  testtime: number;
  timeopen: string;
  timeclose: string;
  result: {
    totalscore: number;
    starttime: string;
    endtime: string;
  };
  questions: Question[];
}

const ViewSubmission = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { submission, loading, error } = useSelector(selectSubmissions) as SubmissionState;
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  useEffect(() => {
    const testId = params.id as string;
    const studentId = params.studentId as string;

    if (testId && studentId) {
      dispatch(fetchSubmissionDetails({ testId, studentId }));
    }
  }, [dispatch, params.id, params.studentId]);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleGoBack = () => {
    router.back();
  };

  const toggleQuestion = (questionId: string) => {
    if (openQuestions.includes(questionId)) {
      setOpenQuestions(openQuestions.filter((id) => id !== questionId));
    } else {
      setOpenQuestions([...openQuestions, questionId]);
    }
  };

  const toggleAllQuestions = () => {
    if (submission && openQuestions.length === submission.questions.length) {
      setOpenQuestions([]); // Collapse all
    } else if (submission) {
      setOpenQuestions(submission.questions.map((q) => q.id)); // Expand all
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-neutral-600">Loading submission details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-red-500">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!submission || !submission.result || !submission.questions) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-neutral-600">No submission data available.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const { result, questions } = submission;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6 flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 rounded-full p-2 transition-colors hover:bg-gray-100"
            title="Go back"
          >
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h2 className="text-3xl font-bold text-neutral-800">Submission Details</h2>
        </div>

        {/* Submission Summary */}
        <section className="mb-12">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-neutral-600">
                  <strong>Total Score:</strong> {result.totalscore.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-neutral-600">
                  <strong>Start Time:</strong> {new Date(result.starttime).toLocaleString()}
                </p>
                <p className="text-neutral-600">
                  <strong>End Time:</strong> {new Date(result.endtime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Questions and Answers with Accordion */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-neutral-800">Questions and Answers</h3>
            <button
              onClick={toggleAllQuestions}
              className="rounded-md bg-primary px-4 py-2 text-white transition hover:bg-secondary"
            >
              {openQuestions.length === questions.length ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
          {questions.length === 0 ? (
            <p className="text-neutral-600">No questions to display.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="overflow-hidden rounded-lg bg-white shadow-md">
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="flex w-full items-center justify-between bg-accent p-6 text-left transition hover:bg-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="text-md font-semibold text-neutral-800">
                        Question {question.id}: {question.content}
                      </h4>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          question.iscorrect
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {question.iscorrect ? <Check size={16} /> : <X size={16} />}
                      </span>
                    </div>
                    <span className="text-neutral-600">
                      {openQuestions.includes(question.id) ? '▲' : '▼'}
                    </span>
                  </button>
                  {openQuestions.includes(question.id) && (
                    <div className="p-6">
                      <p className="mb-2 text-neutral-600">
                        <strong>Score:</strong> {question.score}
                      </p>
                      <div className="space-y-2">
                        {question.answers.map((answer) => {
                          const isCorrect = answer.iscorrect;
                          const isSelected = answer.id === question.answerid;
                          const isWrongSelection = isSelected && !isCorrect;

                          return (
                            <div
                              key={answer.id}
                              className={`flex items-center justify-between rounded-md p-3 ${
                                isCorrect
                                  ? 'border-l-4 border-green-500 bg-green-100 text-green-800'
                                  : isWrongSelection
                                    ? 'border-l-4 border-red-500 bg-red-100 text-red-800'
                                    : 'bg-gray-50 text-neutral-600'
                              }`}
                            >
                              <div className="flex-grow">{answer.content}</div>
                              <div className="ml-2 flex items-center">
                                {isSelected && <span className="mr-2 font-medium">(Selected)</span>}
                                {isCorrect ? (
                                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200">
                                    <Check size={16} className="text-green-700" />
                                  </span>
                                ) : (
                                  isWrongSelection && (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-200">
                                      <X size={16} className="text-red-700" />
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ViewSubmission;
