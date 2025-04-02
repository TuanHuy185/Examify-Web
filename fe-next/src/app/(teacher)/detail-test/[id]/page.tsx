'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import {
  fetchTestDetails,
  updateTest,
  deleteTest,
  selectTeacherTests,
} from '@/store/slices/teacherTestSlice';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Test, TeacherTestState } from '@/types/slices';

interface ApiTest {
  id: string;
  title: string;
  description: string;
  testtime: number;
  timeopen: string;
  timeclose: string;
  passcode: string;
  numberOfQuestion: number;
  teacherId?: number;
  deletedQuestionIds?: string[];
  questions: {
    id?: string;
    content: string;
    score: number;
    answers: {
      id?: string;
      content: string;
      iscorrect: boolean;
    }[];
  }[];
}

interface EditedTest {
  id?: string;
  title: string;
  description: string;
  testTime: number;
  timeOpen: string;
  timeClose: string;
  passcode: string;
  teacherId: number;
  numberOfQuestion: number;
  deletedQuestionIds?: string[];
  questions: {
    id?: string;
    content: string;
    score: number;
    answers: {
      id?: string;
      content: string;
      isCorrect: boolean;
    }[];
  }[];
}

interface Question {
  id?: string;
  content: string;
  score: number;
  answers: {
    id?: string;
    content: string;
    isCorrect: boolean;
  }[];
}

const TestDetails = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentTest, loading, error } = useSelector(selectTeacherTests) as TeacherTestState;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTest, setEditedTest] = useState<EditedTest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check authentication
    const userRole = localStorage.getItem('userRole');
    if (!userRole || userRole.toLowerCase() !== 'teacher') {
      toast.error("You don't have permission to access this page");
      router.push('/dashboard');
      return;
    }

    const testId = params.id as string;
    if (testId) {
      dispatch(fetchTestDetails(testId));
    } else {
      toast.error('Invalid test ID');
      router.push('/dashboard');
    }
  }, [dispatch, router, params.id]);

  useEffect(() => {
    if (currentTest) {
      // Convert API response to match our interface
      const apiTest = currentTest as unknown as ApiTest;
      const convertedTest: EditedTest = {
        ...apiTest,
        teacherId: apiTest.teacherId || 0,
        testTime: apiTest.testtime,
        timeOpen: apiTest.timeopen,
        timeClose: apiTest.timeclose,
        questions: apiTest.questions.map((q) => ({
          ...q,
          answers: q.answers.map((a) => ({
            ...a,
            isCorrect: a.iscorrect,
          })),
        })),
      };
      setEditedTest(convertedTest);
    }
  }, [currentTest]);

  const handleGoBack = () => {
    router.back();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && currentTest) {
      setEditedTest(JSON.parse(JSON.stringify(currentTest)));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name !== 'passcode' && editedTest) {
      setEditedTest({ ...editedTest, [name]: value });
    }
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    if (!editedTest) return;
    setEditedTest({
      ...editedTest,
      questions: editedTest.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    });
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    field: string,
    value: string | boolean
  ) => {
    if (!editedTest) return;
    setEditedTest({
      ...editedTest,
      questions: editedTest.questions.map((q, i) => {
        if (i === qIndex) {
          return {
            ...q,
            answers: q.answers.map((a, j) => (j === oIndex ? { ...a, [field]: value } : a)),
          };
        }
        return q;
      }),
    });
  };

  const handleDeleteQuestionConfirm = (questionIndex: number) => {
    setQuestionToDelete(questionIndex);
    setShowDeleteQuestionModal(true);
  };

  const handleDeleteQuestion = () => {
    if (questionToDelete !== null && editedTest) {
      setEditedTest({
        ...editedTest,
        questions: editedTest.questions.filter((_, idx) => idx !== questionToDelete),
      });

      setShowDeleteQuestionModal(false);
      setQuestionToDelete(null);
      toast.success('Question deleted successfully');
    }
  };

  const handleSave = async () => {
    if (!editedTest) return;
    try {
      if (Number(editedTest.testTime) <= 0) {
        toast.error('Test duration must be a positive number');
        return;
      }

      if (editedTest.questions.length === 0) {
        toast.error('Test must contain at least one question');
        return;
      }

      const invalidQuestions = editedTest.questions.filter(
        (q) => !q.answers.some((a) => a.isCorrect)
      );

      if (invalidQuestions.length > 0) {
        toast.error(
          `Question ${invalidQuestions[0].id || 'unknown'} must have at least one correct answer`
        );
        return;
      }

      const teacherId = localStorage.getItem('userId');
      if (!teacherId) {
        toast.error('Teacher ID not found');
        return;
      }

      const testToSave = {
        ...editedTest,
        teacherId: Number(teacherId),
        numberOfQuestion: editedTest.questions.length,
      };

      console.log('Saving test:', testToSave);
      const result = await dispatch(updateTest(testToSave as unknown as Test)).unwrap();
      console.log('Save result:', result);

      if (editedTest.id) {
        await dispatch(fetchTestDetails(editedTest.id)).unwrap();
      }

      setIsEditing(false);
      toast.success('Test updated successfully');
    } catch (err) {
      console.error('Save error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error('Failed to save changes: ' + errorMessage);
    }
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteTest = async () => {
    if (!editedTest || !editedTest.id) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteTest(editedTest.id)).unwrap();
      setShowDeleteModal(false);
      toast.success('Test deleted successfully');
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete test: ${errorMessage}`);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredQuestions =
    editedTest?.questions
      ?.map((q, index) => ({ ...q, originalIndex: index }))
      .filter((q) => {
        const query = searchQuery.toLowerCase();
        const indexStr = (q.originalIndex! + 1).toString();
        return q.content.toLowerCase().includes(query) || indexStr.includes(query);
      }) || [];

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-xl text-neutral-600">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );

  if (!currentTest || !editedTest)
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-xl text-neutral-600">Test not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 rounded-full p-2 transition-colors hover:bg-gray-100"
            title="Go back"
          >
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h2 className="text-3xl font-bold text-neutral-800">Test Details</h2>
          <div className="flex-grow"></div>
          <button
            onClick={handleDeleteConfirmation}
            className="mr-3 flex items-center rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            title="Delete Test"
          >
            <Trash2 size={18} className="mr-1" /> Delete Test
          </button>
          <button
            onClick={handleEditToggle}
            className="rounded-md bg-primary px-6 py-2 text-white transition hover:bg-secondary"
          >
            {isEditing ? 'Cancel' : 'Edit Test'}
          </button>
        </div>

        {/* Test Details */}
        <div className="mb-12 rounded-lg bg-white p-6 shadow-md">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-neutral-600">Title</label>
              <input
                type="text"
                name="title"
                value={editedTest.title}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-neutral-600">Duration (minutes)</label>
              <input
                type="number"
                name="testTime"
                value={editedTest.testTime}
                onChange={handleInputChange}
                disabled={!isEditing}
                min={1}
                className="w-full rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-neutral-600">Time Open</label>
              <input
                type="datetime-local"
                name="timeOpen"
                value={editedTest.timeOpen ? editedTest.timeOpen.slice(0, 16) : ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-neutral-600">Time Close</label>
              <input
                type="datetime-local"
                name="timeClose"
                value={editedTest.timeClose ? editedTest.timeClose.slice(0, 16) : ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-neutral-600">Passcode</label>
              <input
                type="text"
                name="passcode"
                value={editedTest.passcode}
                disabled={true}
                className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-3 py-2 text-neutral-600"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="mb-2 block font-medium text-neutral-600">Description</label>
            <textarea
              name="description"
              value={editedTest.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>
        </div>

        {/* Questions Section with Search Bar */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-neutral-800">
              Questions ({editedTest.questions.length})
            </h3>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by question text or number..."
              className="w-1/3 rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {filteredQuestions.length === 0 ? (
            <p className="text-neutral-600">No questions match your search.</p>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q.originalIndex} className="mb-4 rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex justify-between">
                  <div className="flex flex-grow items-center">
                    <span className="mr-2 font-semibold text-neutral-800">
                      Question {q.originalIndex! + 1}
                    </span>
                    <input
                      type="text"
                      value={q.content}
                      onChange={(e) =>
                        handleQuestionChange(q.originalIndex!, 'content', e.target.value)
                      }
                      disabled={!isEditing}
                      className="flex-grow rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteQuestionConfirm(q.originalIndex!)}
                      className="ml-2 rounded-full p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                      title="Delete Question"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                {q.answers.map((opt, oIndex) => (
                  <div
                    key={oIndex}
                    className={`mb-2 flex items-center gap-4 ${opt.isCorrect ? 'text-green-600' : 'text-neutral-600'}`}
                  >
                    <input
                      type="text"
                      value={opt.content}
                      onChange={(e) =>
                        handleOptionChange(q.originalIndex!, oIndex, 'content', e.target.value)
                      }
                      disabled={!isEditing}
                      className="flex-grow rounded-md border border-neutral-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={opt.isCorrect}
                        onChange={(e) =>
                          handleOptionChange(
                            q.originalIndex!,
                            oIndex,
                            'isCorrect',
                            e.target.checked
                          )
                        }
                        disabled={!isEditing}
                        className="mr-2 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
            ))
          )}
        </section>

        {/* Save Button (only visible in edit mode) */}
        {isEditing && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-md bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Delete Test Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-red-600">Confirm Delete Test</h3>
              <p className="mb-6 text-neutral-700">
                Are you sure you want to delete this test? This action cannot be undone and will
                remove all related student results.
              </p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTest}
                  disabled={isDeleting}
                  className="flex-1 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:bg-red-300"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Test'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Question Confirmation Modal */}
        {showDeleteQuestionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-red-600">Confirm Delete Question</h3>
              <p className="mb-6 text-neutral-700">
                Are you sure you want to delete question #{questionToDelete! + 1}? This action
                cannot be undone.
              </p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setShowDeleteQuestionModal(false)}
                  className="flex-1 rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteQuestion}
                  className="flex-1 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete Question
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TestDetails;
