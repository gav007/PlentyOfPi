
'use client';

import OnboardingCard from './OnboardingCard';
import LessonViewer from './LessonViewer';
import PythonSandbox from './PythonSandbox';
import GamifiedSection from './GamifiedSection';
import AssessmentLink from './AssessmentLink';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileCode, Brain, BookOpenCheck, Puzzle, ClipboardCheck, Code } from 'lucide-react'; // Added Code icon
import pythonFoundationsModules from '@/config/pythonFoundationsContent'; // Import the new content

export default function PythonFoundationsLayout() {
  // Use the imported lesson structure
  const lessons = pythonFoundationsModules;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <Code className="w-10 h-10" /> {/* Changed Icon */}
          Python Foundations
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your journey to mastering Python starts here. Prepare for the PCEP certification!
        </p>
      </header>

      <OnboardingCard />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
             <Brain className="w-6 h-6 text-primary" />
            Python Code Sandbox
          </CardTitle>
          <CardDescription>
            Experiment with Python code live in your browser. Try out the examples from the lessons and labs!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PythonSandbox />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpenCheck className="w-6 h-6 text-primary" />
            Course Modules, Labs & Quizzes
          </CardTitle>
          <CardDescription>
            Learn Python concepts module by module. Each module includes lessons, hands-on labs, and short quizzes to reinforce learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LessonViewer lessons={lessons} />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Puzzle className="w-6 h-6 text-primary" />
            Gamified Learning Activities
          </CardTitle>
          <CardDescription>
            Reinforce your learning with interactive challenges. (Currently placeholders, full games coming soon!)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GamifiedSection />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ClipboardCheck className="w-6 h-6 text-primary" />
            Final Assessment (PCEP Style)
          </CardTitle>
          <CardDescription>
            Test your overall understanding and readiness for PCEP-style questions. (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssessmentLink />
        </CardContent>
      </Card>

    </div>
  );
}

    