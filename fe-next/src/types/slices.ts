// Test Types
export interface Test {
    id: string;
    title: string;
    description?: string;
    duration: number;
    startTime?: string;
    endTime?: string;
    questions: Question[];
    teacherId: string;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
    passcode: string;
    testtime: number;
    timeopen: string;
    timeclose: string;
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
    score: number;
    submittedAt: string;
    answers: Answer[];
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
    username: string;
    email: string;
    role: 'STUDENT' | 'TEACHER';
    firstName?: string;
    lastName?: string;
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