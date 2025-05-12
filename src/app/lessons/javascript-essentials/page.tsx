
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import jsFoundationsModules from '@/config/jsFoundationsContent';
import { Code as CodeIcon, ArrowRight, BookOpen, FlaskConical, HelpCircle, Target, SearchCode, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JavaScript Essentials | Plenty of π',
  description: 'Learn core JavaScript concepts step by step with interactive lessons, labs, and quizzes.',
};

const gamifiedActivitiesJS = [
  {
    title: 'JS Output Match',
    description: 'Test your understanding of JavaScript execution by matching code snippets to their correct output.',
    href: '/lessons/javascript-essentials/output-match',
    icon: Target,
  },
  {
    title: 'JS Syntax Spotter',
    description: 'Sharpen your JavaScript debugging skills. Find and identify syntax errors in various code examples.',
    href: '/lessons/javascript-essentials/syntax-spotter',
    icon: SearchCode,
  },
  {
    title: 'JS Debug It! Puzzles',
    description: 'Become a JavaScript detective! Fix broken code snippets and make them run correctly using a live sandbox.',
    href: '/lessons/javascript-essentials/debug-it',
    icon: Wrench,
  },
];

export default function JavaScriptEssentialsDashboardPage() {
  const modules = jsFoundationsModules;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl flex items-center justify-center gap-3">
          <CodeIcon className="w-10 h-10" /> JavaScript Essentials
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your learning journey to master core JavaScript concepts for web development and beyond.
        </p>
      </header>

      {modules.length === 0 ? (
        <p className="text-center text-muted-foreground text-xl">
          No JavaScript modules available yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => {
            const lessonsCount = module.lessons?.length || 0;
            const labsCount = module.labs?.length || 0;
            const quizzesCount = module.quizzes?.length || 0;
            
            let startLink = `/lessons/javascript-essentials/${module.slug}/lesson/${module.lessons[0]?.slug || 'overview'}`;
            if (lessonsCount === 0 && labsCount > 0 && module.labs) {
              startLink = `/lessons/javascript-essentials/${module.slug}/lab/${module.labs[0]?.slug}`;
            } else if (lessonsCount === 0 && labsCount === 0 && quizzesCount > 0 && module.quizzes) {
              startLink = `/lessons/javascript-essentials/${module.slug}/quiz/${module.quizzes[0]?.slug}`;
            }

            return (
              <Card key={module.slug} className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <BookOpen className="w-8 h-8 text-primary" />
                     <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                      Module {index + 1}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-sm mb-3">
                    {module.description || `Explore lessons, labs, and quizzes in ${module.title}.`}
                  </CardDescription>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {lessonsCount > 0 && <p className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary/70"/>{lessonsCount} Lesson{lessonsCount !== 1 ? 's' : ''}</p>}
                    {labsCount > 0 && <p className="flex items-center gap-1.5"><FlaskConical className="w-4 h-4 text-green-600/70"/>{labsCount} Lab{labsCount !== 1 ? 's' : ''}</p>}
                    {quizzesCount > 0 && <p className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-blue-600/70"/>{quizzesCount} Quiz{quizzesCount !== 1 ? 'zes' : ''}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={startLink}>
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
      
      <div className="mt-16 text-center border-t pt-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">Sharpen Your JS Skills</h2>
        <div className="space-y-6">
            <p className="text-muted-foreground">
                Reinforce your learning with these interactive JavaScript challenges.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gamifiedActivitiesJS.map((activity) => (
                <Card key={activity.title} className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03]">
                    <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <activity.icon className="w-7 h-7 text-yellow-500" />
                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                    </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    <CardDescription>{activity.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                        <Link href={activity.href}>
                        Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
        </div>
      </div>

      {/* Placeholder for JS-specific assessment links if needed later */}
      {/* 
      <div className="mt-16 text-center border-t pt-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">Test Your Knowledge</h2>
        <AssessmentLink courseType="javascript" />
      </div>
      */}
    </div>
  );
}
