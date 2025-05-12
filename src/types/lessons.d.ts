
export interface LessonItem {
  subTitle: string;
  text: string; // Can contain markdown for formatting (newlines, bold, etc.)
}

export interface LabItem {
  title: string;
  description: string;
  starterCode?: string;
  tasks?: string[]; // List of tasks for the lab
  hints?: string[]; // Optional hints for the lab
}

export interface QuizQuestion {
  question: string;
  options: Record<string, string>; // e.g., { A: "Option A", B: "Option B" }
  answer: string; // Key of the correct option (e.g., "A")
  feedback: string; // Explanation for the correct answer
}

export interface QuizItem {
  title: string;
  questionsCount: number;
  questions: QuizQuestion[];
}

export interface LessonModule {
  title: string;
  content: LessonItem[];
  labs?: LabItem[];
  quizzes?: QuizItem[];
}

    