
import type { Metadata } from 'next';
import pythonFoundationsModules from '@/config/pythonFoundationsContent';
// import QuizPageContent from '@/components/python-foundations/QuizPageContent'; // To be created
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';


// Placeholder for QuizPageContent component until it's built
const QuizPageContentPlaceholder = ({ quizTitle, moduleTitle }: { quizTitle: string, moduleTitle: string }) => (
  <Card className="shadow-xl w-full">
    <CardHeader>
      <CardDescription className="text-sm text-primary">{moduleTitle}</CardDescription>
      <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
        <HelpCircle className="w-7 h-7" /> Quiz: {quizTitle}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-lg">
        Quiz content and interactivity coming soon! This page will contain the questions for the '{quizTitle}' quiz.
      </p>
    </CardContent>
  </Card>
);


interface PythonQuizPageProps {
  params: {
    moduleSlug: string;
    quizSlug: string;
  };
}

export async function generateStaticParams() {
  const params: { moduleSlug: string; quizSlug: string }[] = [];
  pythonFoundationsModules.forEach(module => {
    module.quizzes?.forEach(quiz => {
      params.push({ moduleSlug: module.slug, quizSlug: quiz.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: PythonQuizPageProps): Promise<Metadata> {
  const module = pythonFoundationsModules.find(m => m.slug === params.moduleSlug);
  const quiz = module?.quizzes?.find(q => q.slug === params.quizSlug);

  if (!quiz || !module) {
    return {
      title: 'Quiz Not Found | Plenty of π',
      description: 'The requested Python quiz could not be found.',
    };
  }

  return {
    title: `Quiz: ${quiz.title} | ${module.title} | Plenty of π`,
    description: `Test your knowledge with the ${quiz.title} quiz in the ${module.title} module of Python Foundations.`,
  };
}

export default function PythonQuizPage({ params }: PythonQuizPageProps) {
  const module = pythonFoundationsModules.find(m => m.slug === params.moduleSlug);
  const quiz = module?.quizzes?.find(q => q.slug === params.quizSlug);

  if (!quiz || !module) {
    notFound();
  }
  
  const moduleIndex = pythonFoundationsModules.findIndex(m => m.slug === params.moduleSlug);
  const currentQuizIndex = module.quizzes?.findIndex(q => q.slug === params.quizSlug) ?? -1;
  
  let prevLink: { href: string; title: string } | null = null;
  let nextLink: { href: string; title: string } | null = null;

  // Previous link logic
  if (module.quizzes && currentQuizIndex > 0) {
    const prevQuiz = module.quizzes[currentQuizIndex - 1];
    prevLink = { href: `/lessons/python-foundations/${module.slug}/quiz/${prevQuiz.slug}`, title: `Quiz: ${prevQuiz.title}` };
  } else { // Link to last lab or lesson of current module
    const lastLab = module.labs?.[module.labs.length - 1];
    if (lastLab) {
      prevLink = { href: `/lessons/python-foundations/${module.slug}/lab/${lastLab.slug}`, title: `Lab: ${lastLab.title}` };
    } else {
      const lastLesson = module.content[module.content.length - 1];
      if (lastLesson) {
        prevLink = { href: `/lessons/python-foundations/${module.slug}/lesson/${lastLesson.slug}`, title: lastLesson.subTitle };
      } else if (moduleIndex > 0) { // Fallback to previous module's last item
          const prevModule = pythonFoundationsModules[moduleIndex -1];
          const lastItem = prevModule.quizzes?.[prevModule.quizzes.length-1] || prevModule.labs?.[prevModule.labs.length-1] || prevModule.content?.[prevModule.content.length-1];
          if(lastItem) {
              let itemType = "lesson";
              if(prevModule.quizzes?.includes(lastItem as any)) itemType="quiz";
              else if(prevModule.labs?.includes(lastItem as any)) itemType="lab";
              prevLink = { href: `/lessons/python-foundations/${prevModule.slug}/${itemType}/${lastItem.slug}`, title: (lastItem as any).title || (lastItem as any).subTitle };
          }
      }
    }
  }

  // Next link logic
  if (module.quizzes && currentQuizIndex < module.quizzes.length - 1) {
    const nextQuiz = module.quizzes[currentQuizIndex + 1];
    nextLink = { href: `/lessons/python-foundations/${module.slug}/quiz/${nextQuiz.slug}`, title: `Quiz: ${nextQuiz.title}` };
  } else if (moduleIndex < pythonFoundationsModules.length -1) { // Link to next module's first item
     const nextModule = pythonFoundationsModules[moduleIndex + 1];
     const firstItem = nextModule.content?.[0] || nextModule.labs?.[0] || nextModule.quizzes?.[0];
     if(firstItem){
        let itemType = "lesson";
        if(nextModule.labs?.includes(firstItem as any)) itemType="lab";
        else if(nextModule.quizzes?.includes(firstItem as any)) itemType="quiz";
        nextLink = { href: `/lessons/python-foundations/${nextModule.slug}/${itemType}/${firstItem.slug}`, title: `Next Module: ${(firstItem as any).title || (firstItem as any).subTitle}`};
     }
  }
  
  // Replace with QuizPageContent once created and logic is implemented
  return (
    <div className="w-full">
        <QuizPageContentPlaceholder quizTitle={quiz.title} moduleTitle={module.title} />
        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          {prevLink ? (
            <Button asChild variant="outline" size="sm">
              <Link href={prevLink.href}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Prev: {prevLink.title.substring(0,20)}{prevLink.title.length > 20 ? '...' : ''}
              </Link>
            </Button>
          ) : (
            <div /> // Placeholder for spacing
          )}
          {nextLink ? (
            <Button asChild variant="default" size="sm">
              <Link href={nextLink.href}>
                Next: {nextLink.title.substring(0,20)}{nextLink.title.length > 20 ? '...' : ''} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
             <Button asChild variant="default" size="sm">
                <Link href={`/lessons/python-foundations/`}>
                    Module Overview <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          )}
        </div>
    </div>
  );
}
