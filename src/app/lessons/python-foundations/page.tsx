
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Added CardFooter
import { Button } from '@/components/ui/button';
import pythonFoundationsModules from '@/config/pythonFoundationsContent';
import type { LessonModule } from '@/types/lessons';
import { FileCode, ArrowRight, BookOpen } from 'lucide-react'; // Added BookOpen

export const metadata: Metadata = {
  title: 'Python Foundations Dashboard | Plenty of π',
  description: 'Track your progress through the Python Foundations course modules.',
};

// Placeholder for progress fetching logic
// In a real app, this would come from localStorage or a backend
const getModuleProgress = (moduleSlug: string) => {
  // Dummy data for now
  const progress = {
    'module-1-introduction': { lessons: 2, totalLessons: 4, labs: 1, totalLabs: 1, quizCompleted: false, quizScore: 0 },
    'module-2-python-basics': { lessons: 1, totalLessons: 6, labs: 0, totalLabs: 1, quizCompleted: false, quizScore: 0 },
  };
  // @ts-ignore
  return progress[moduleSlug] || { lessons: 0, totalLessons: 1, labs: 0, totalLabs: 0, quizCompleted: false, quizScore: 0 };
};

export default function PythonFoundationsDashboardPage() {
  const modules = pythonFoundationsModules;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl flex items-center justify-center gap-3">
          <FileCode className="w-10 h-10" /> Python Foundations
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your learning journey to master Python for the PCEP certification. Track your progress through each module.
        </p>
      </header>

      {modules.length === 0 ? (
        <p className="text-center text-muted-foreground text-xl">
          No modules available yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => {
            const progress = getModuleProgress(module.slug);
            const totalItems = (module.content?.length || 0) + (module.labs?.length || 0) + (module.quizzes?.length || 0);
            const completedItems = progress.lessons + progress.labs + (progress.quizCompleted ? 1 : 0);
            const percentageComplete = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            return (
              <Card key={module.slug} className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {percentageComplete}% Complete
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-sm">
                    {/* Placeholder description, can be added to LessonModule type */}
                    Dive into {module.content?.length || 0} lessons, {module.labs?.length || 0} labs, and {module.quizzes?.length || 0} quiz sections.
                  </CardDescription>
                  {/* Basic progress indicators - to be replaced by ProgressCard component later */}
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p>Lessons: {progress.lessons} / {module.content?.length || 0}</p>
                    <p>Labs: {progress.labs} / {module.labs?.length || 0}</p>
                    <p>Quiz: {progress.quizCompleted ? `Passed (${progress.quizScore}%)` : 'Pending'}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    {/* Link to the first item in the module or a module overview page */}
                    <Link href={`/lessons/python-foundations/${module.slug}/lesson/${module.content[0]?.slug || 'overview'}`}>
                      Start Module
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
       <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-primary mb-4">Gamified Challenges & PCEP Assessment</h2>
        <p className="text-muted-foreground mb-6">
            Once you've worked through the modules, test your skills with interactive games and a PCEP-style final assessment.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline">
                <Link href="/lessons/python-foundations/output-match">Output Match Challenge</Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/lessons/python-foundations/syntax-spotter">Syntax Spotter</Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/lessons/python-foundations/debug-it">Debug It! Puzzles</Link>
            </Button>
            <Button asChild>
                <Link href="/lessons/python-foundations/assessment">PCEP Final Assessment</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
