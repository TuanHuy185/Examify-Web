export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  TEACHER: {
    DASHBOARD: '/teacher',
    TESTS: '/teacher/tests',
    CREATE_TEST: '/teacher/tests/create',
    EDIT_TEST: (id: string) => `/teacher/tests/${id}/edit`,
    VIEW_TEST: (id: string) => `/teacher/tests/${id}`,
  },
  STUDENT: {
    DASHBOARD: '/student',
    TESTS: '/student/tests',
    TAKE_TEST: (id: string) => `/student/tests/${id}`,
    RESULTS: '/student/results',
  },
} as const;
