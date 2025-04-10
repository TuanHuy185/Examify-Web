// Test Types
export interface Test {
  id?: string;
  title: string;
  passcode?: string;
  description: string;
  testTime: number;
  timeOpen: string;
  timeClose: string;
  teacherId: number;
  numberOfQuestion: number;
  questions: {
    content: string;
    score: number;
    answers: {
      content: string;
      isCorrect: boolean;
    }[];
  }[];
}

export interface Question {
  id: string;
  content: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  studentID: string;
  studentName: string;
  totalScore: number;
  startTime: string;
  endTime: string;
  questions: {
    id: string;
    content: string;
    score: number;
    testid: string;
    answers: {
      id: string;
      content: string;
      iscorrect: boolean;
    }[];
    answerid: string;
    iscorrect: boolean;
  }[];
}

export interface Answer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER';
  date_of_birth: string;
}

// State Types
export interface TeacherTestState {
  tests: Test[];
  currentTest: Test | null;
  allTestResults: TestResult[];
  loading: boolean;
  error: string | null;
}

export interface StudentTestState {
  pastResults: TestResult[];
  loading: boolean;
  error: string | null;
}

export interface SubmissionState {
  submission: TestResult | null;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  userInfo: User | null;
  loading: boolean;
  error: string | null;
}
