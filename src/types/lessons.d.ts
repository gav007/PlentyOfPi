
export interface LessonItem {
  slug: string; // Added for routing
  subTitle: string;
  text: string; // Can contain markdown for formatting (newlines, bold, etc.)
}

export interface LabItem {
  slug: string; // Added for routing
  title: string;
  description: string;
  starterCode?: string;
  tasks?: string[]; // List of tasks for the lab
  hints?: string[]; // Optional hints for the lab
  solutionCode?: string; // Optional solution code
  solutionExplanation?: string; // Optional explanation for the solution
}

export interface QuizQuestion {
  question: string;
  options: Record<string, string>; // e.g., { A: "Option A", B: "Option B" }
  answer: string; // Key of the correct option (e.g., "A")
  feedback: string; // Explanation for the correct answer
}

export interface QuizItem {
  slug: string; // Added for routing
  title: string;
  questionsCount: number;
  questions: QuizQuestion[];
}

export interface LessonModule {
  slug: string; // Added for routing
  title: string;
  description?: string; // Add description for module card
  content: LessonItem[];
  labs?: LabItem[];
  quizzes?: QuizItem[];
}
