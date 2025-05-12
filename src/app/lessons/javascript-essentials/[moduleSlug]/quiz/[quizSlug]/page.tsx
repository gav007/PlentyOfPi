import type { Metadata } from 'next';
import jsFoundationsModules from '@/config/jsFoundationsContent';
import JSQuizPageContent from '@/components/javascript-essentials/JSQuizPageContent'; // Adjusted import
import { notFound } from 'next/navigation';
import type { JSModule } from '@/types/javascript-lessons';

interface JSQuizPageProps {
  params: {
    moduleSlug: string;
    quizSlug: string;
  };
}

export async function generateStaticParams() {
  const params: { moduleSlug: string; quizSlug: string }[] = [];
  jsFoundationsModules.forEach(module => {
    module.quizzes?.forEach(quiz => {
      params.push({ moduleSlug: module.slug, quizSlug: quiz.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: JSQuizPageProps): Promise<Metadata> {
  const module = jsFoundationsModules.find(m => m.slug === params.moduleSlug);
  const quiz = module?.quizzes?.find(q => q.slug === params.quizSlug);

  if (!quiz || !module) {
    return {
      title: 'Quiz Not Found | Plenty of π',
      description: 'The requested JavaScript quiz could not be found.',
    };
  }

  return {
    title: `Quiz: ${quiz.title} | ${module.title} | Plenty of π`,
    description: `Test your knowledge with the ${quiz.title} quiz in the ${module.title} module of JavaScript Essentials.`,
  };
}

export default function JSQuizPage({ params }: JSQuizPageProps) {
  const module = jsFoundationsModules.find(m => m.slug === params.moduleSlug);
  const quiz = module?.quizzes?.find(q => q.slug === params.quizSlug);

  if (!quiz || !module) {
    notFound();
  }
  
  const moduleIndex = jsFoundationsModules.findIndex(m => m.slug === params.moduleSlug);
  const currentQuizIndex = module.quizzes?.findIndex(q => q.slug === params.quizSlug) ?? -1;
  
  let prevLink: { href: string; title: string } | null = null;
  let nextLink: { href: string; title: string } | null = null;

  // Previous link logic
  if (module.quizzes && currentQuizIndex > 0) {
    const prevQuiz = module.quizzes[currentQuizIndex - 1];
    prevLink = { href: `/lessons/javascript-essentials/${module.slug}/quiz/${prevQuiz.slug}`, title: `Quiz: ${prevQuiz.title}` };
  } else { 
    const lastLab = module.labs?.[module.labs.length - 1];
    if (lastLab) {
      prevLink = { href: `/lessons/javascript-essentials/${module.slug}/lab/${lastLab.slug}`, title: `Lab: ${lastLab.title}` };
    } else {
      const lastLesson = module.lessons[module.lessons.length - 1];
      if (lastLesson) {
        prevLink = { href: `/lessons/javascript-essentials/${module.slug}/lesson/${lastLesson.slug}`, title: lastLesson.subTitle };
      } else if (moduleIndex > 0) { 
          const prevModule = jsFoundationsModules[moduleIndex -1];
          const lastItem = prevModule.quizzes?.[prevModule.quizzes.length-1] || prevModule.labs?.[prevModule.labs.length-1] || prevModule.lessons?.[prevModule.lessons.length-1];
          if(lastItem) {
              let itemType = "lesson";
              if (prevModule.quizzes?.some(q => q.slug === (lastItem as any).slug)) itemType = "quiz";
              else if (prevModule.labs?.some(l => l.slug === (lastItem as any).slug)) itemType = "lab";
              prevLink = { href: `/lessons/javascript-essentials/${prevModule.slug}/${itemType}/${lastItem.slug}`, title: (lastItem as any).title || (lastItem as any).subTitle };
          }
      }
    }
  }

  // Next link logic
  if (module.quizzes && currentQuizIndex < module.quizzes.length - 1) {
    const nextQuiz = module.quizzes[currentQuizIndex + 1];
    nextLink = { href: `/lessons/javascript-essentials/${module.slug}/quiz/${nextQuiz.slug}`, title: `Quiz: ${nextQuiz.title}` };
  } else if (moduleIndex < jsFoundationsModules.length -1) { 
     const nextModule = jsFoundationsModules[moduleIndex + 1];
     const firstItem = nextModule.lessons?.[0] || nextModule.labs?.[0] || nextModule.quizzes?.[0];
     if(firstItem){
        let itemType = "lesson";
        if (nextModule.labs?.some(l => l.slug === (firstItem as any).slug)) itemType = "lab";
        else if (nextModule.quizzes?.some(q => q.slug === (firstItem as any).slug)) itemType = "quiz";
        nextLink = { href: `/lessons/javascript-essentials/${nextModule.slug}/${itemType}/${firstItem.slug}`, title: `Next Module: ${(firstItem as any).title || (firstItem as any).subTitle}`};
     }
  }
  
  return <JSQuizPageContent quiz={quiz} moduleTitle={module.title} prevLink={prevLink} nextLink={nextLink} />;
}