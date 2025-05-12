export interface JSLessonItem {
  slug: string;
  subTitle: string;
  text: string; // Can contain markdown
}

export interface JSLabItem {
  slug: string;
  title: string;
  description: string;
  starterCode?: string;
  tasks?: string[];
  hints?: string[];
  solutionCode?: string;
  solutionExplanation?: string;
  expectedOutput?: string; // For checking lab completion
}

export interface JSQuizQuestion {
  question: string;
  options: Record<string, string>; // e.g., { A: "Option A", B: "Option B" }
  answer: string; // Key of the correct option (e.g., "A")
  feedback: string; // Explanation for the correct answer
}

export interface JSQuizItem {
  slug: string;
  title: string;
  questionsCount: number;
  questions: JSQuizQuestion[];
}

export interface JSModule {
  slug: string; // e.g., "module-1-introduction"
  title: string;
  description?: string;
  lessons: JSLessonItem[];
  labs?: JSLabItem[];
  quizzes?: JSQuizItem[];
}
