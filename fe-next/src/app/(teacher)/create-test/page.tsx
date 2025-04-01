// CreateTest.tsx
'use client';

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { createTest } from "@/store/slices/teacherTestSlice";
import { toast } from "react-toastify";
import { ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  options: Option[];
}

interface TestData {
  title: string;
  description: string;
  testTime: string;
  startTime: string;
  closeTime: string;
  questions: Question[];
}

const CreateTest = () => {
  const router = useRouter();

  // Single state object for all test data
  const [testData, setTestData] = useState<TestData>({
    title: "",
    description: "",
    testTime: "",
    startTime: "",
    closeTime: "",
    questions: [],
  });

  // State for the current question being added
  const [newQuestion, setNewQuestion] = useState<Question>({
    text: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const handleGoBack = () => {
    router.back();
  };

  // Handle changes to test details
  const handleTestDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes to new question text
  const handleQuestionTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewQuestion((prev) => ({ ...prev, text: e.target.value }));
  };

  // Handle changes to options (text or isCorrect)
  const handleOptionChange = (index: number, field: keyof Option, value: string | boolean) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  // Add a new option to the current question
  const addOption = () => {
    if (newQuestion.options.length < 4) {
      setNewQuestion((prev) => ({
        ...prev,
        options: [...prev.options, { text: "", isCorrect: false }],
      }));
    }
  };

  // Remove an option from the current question
  const removeOption = (index: number) => {
    if (newQuestion.options.length > 2) {
      const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
      setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
    }
  };

  // Add the current question to the testData.questions array
  const addQuestion = () => {
    if (!newQuestion.text || newQuestion.options.some((opt) => !opt.text)) {
      alert("Please fill in the question and all options");
      return;
    }
    if (!newQuestion.options.some((opt) => opt.isCorrect)) {
      alert("Please mark at least one option as correct");
      return;
    }
    setTestData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setNewQuestion({
      text: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
  };

  // Remove a question from testData.questions
  const removeQuestion = (index: number) => {
    const updatedQuestions = testData.questions.filter((_, i) => i !== index);
    setTestData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Move a question up in the list
  const moveQuestionUp = (index: number) => {
    if (index > 0) {
      const updatedQuestions = [...testData.questions];
      const temp = updatedQuestions[index];
      updatedQuestions[index] = updatedQuestions[index - 1];
      updatedQuestions[index - 1] = temp;
      setTestData((prev) => ({ ...prev, questions: updatedQuestions }));
    }
  };

  // Move a question down in the list
  const moveQuestionDown = (index: number) => {
    if (index < testData.questions.length - 1) {
      const updatedQuestions = [...testData.questions];
      const temp = updatedQuestions[index];
      updatedQuestions[index] = updatedQuestions[index + 1];
      updatedQuestions[index + 1] = temp;
      setTestData((prev) => ({ ...prev, questions: updatedQuestions }));
    }
  };

  // Submit the entire testData to the API
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !testData.title ||
      !testData.testTime ||
      !testData.startTime ||
      !testData.closeTime
    ) {
      alert("Please fill in all test details");
      return;
    }
    if (parseInt(testData.testTime, 10) <= 0) {
      toast.error("Test duration must be a positive number");
      return;
    }
    if (testData.questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    // Format the testData to match the API structure
    const formattedTestData = {
      title: testData.title,
      description: testData.description,
      duration: parseInt(testData.testTime, 10),
      startTime: testData.startTime,
      endTime: testData.closeTime,
      teacherId: localStorage.getItem("userId") || "",
      status: "DRAFT" as const,
      passcode: "",
      testtime: parseInt(testData.testTime, 10),
      timeopen: testData.startTime,
      timeclose: testData.closeTime,
      questions: testData.questions.map((q, index) => ({
        id: `temp-${index}`,
        content: q.text,
        type: "MULTIPLE_CHOICE" as const,
        options: q.options.map(opt => opt.text),
        correctAnswer: q.options.filter(opt => opt.isCorrect).map(opt => opt.text),
        points: 1.0
      }))
    };

    try {
      await createTest(formattedTestData);
      toast.success("Test created successfully");
      router.push("/teacher");
    } catch (error: any) {
      alert("Failed to create test: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={handleGoBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Go back"
          >
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h2 className="text-3xl font-bold text-neutral-800">
            Create New Test
          </h2>
        </div>

        {/* Test Details Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Test Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={testData.title}
                onChange={handleTestDetailsChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter test title"
                required
              />
            </div>
            <div>
              <label
                htmlFor="testTime"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Test Duration (minutes)
              </label>
              <input
                type="number"
                id="testTime"
                name="testTime"
                value={testData.testTime}
                onChange={handleTestDetailsChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 60"
                min="1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="startTime"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Start Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={testData.startTime}
                onChange={handleTestDetailsChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label
                htmlFor="closeTime"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Close Time
              </label>
              <input
                type="datetime-local"
                id="closeTime"
                name="closeTime"
                value={testData.closeTime}
                onChange={handleTestDetailsChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-neutral-600 mb-2 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={testData.description}
              onChange={handleTestDetailsChange}
              className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter test description"
              rows={4}
            />
          </div>
        </form>

        {/* Questions Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Add Questions
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label
                htmlFor="questionText"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Question
              </label>
              <input
                type="text"
                id="questionText"
                value={newQuestion.text}
                onChange={handleQuestionTextChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your question"
              />
            </div>
            <div className="mb-6">
              <label className="block text-neutral-600 mb-2 font-medium">
                Options
              </label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(index, "text", e.target.value)
                    }
                    className="flex-grow px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Option ${index + 1}`}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(index, "isCorrect", e.target.checked)
                      }
                      className="mr-2 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    Correct
                  </label>
                  {newQuestion.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {newQuestion.options.length < 4 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="text-primary hover:underline mt-2"
                >
                  Add Option
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition"
            >
              Add Question
            </button>
          </div>

          {/* Display Added Questions */}
          {testData.questions.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xl font-semibold text-neutral-800 mb-4">
                Added Questions
              </h4>
              {testData.questions.map((q, index) => (
                <div key={index} className="bg-accent p-4 rounded-md mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <p className="text-neutral-800 font-medium">
                        {index + 1}. {q.text}
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className={
                              opt.isCorrect
                                ? "text-green-600"
                                : "text-neutral-600"
                            }
                          >
                            {opt.text} {opt.isCorrect && "(Correct)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => moveQuestionUp(index)}
                          disabled={index === 0}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            index === 0
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-blue-500"
                          }`}
                          title="Move Up"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestionDown(index)}
                          disabled={index === testData.questions.length - 1}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            index === testData.questions.length - 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-blue-500"
                          }`}
                          title="Move Down"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-500 hover:text-red-700 font-medium ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            type="submit"
            form="testForm"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition"
          >
            Save Test
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTest;
