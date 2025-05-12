import type { Metadata } from 'next';
import jsFoundationsModules from '@/config/jsFoundationsContent';
import JSLessonPageContent from '@/components/javascript-essentials/JSLessonPageContent'; // Adjusted import
import { notFound } from 'next/navigation';
import type { JSModule } from '@/types/javascript-lessons';

interface JSLessonPageProps {
  params: {
    moduleSlug: string;
    lessonSlug: string;
  };
}

export async function generateStaticParams() {
  const params: { moduleSlug: string; lessonSlug: string }[] = [];
  jsFoundationsModules.forEach(module => {
    module.lessons.forEach(lesson => {
      params.push({ moduleSlug: module.slug, lessonSlug: lesson.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: JSLessonPageProps): Promise<Metadata> {
  const module = jsFoundationsModules.find(m => m.slug === params.moduleSlug);
  const lesson = module?.lessons.find(l => l.slug === params.lessonSlug);

  if (!lesson || !module) {
    return {
      title: 'Lesson Not Found | Plenty of π',
      description: 'The requested JavaScript lesson could not be found.',
    };
  }

  return {
    title: `${lesson.subTitle} | ${module.title} | Plenty of π`,
    description: `Learn about ${lesson.subTitle} in the ${module.title} of JavaScript Essentials.`,
  };
}

export default function JSLessonPage({ params }: JSLessonPageProps) {
  const module = jsFoundationsModules.find(m => m.slug === params.moduleSlug);
  const lesson = module?.lessons.find(l => l.slug === params.lessonSlug);

  if (!lesson || !module) {
    notFound();
  }
  
  const moduleIndex = jsFoundationsModules.findIndex(m => m.slug === params.moduleSlug);
  const currentLessonIndex = module.lessons.findIndex(l => l.slug === params.lessonSlug);
  
  let prevLink: { href: string; title: string } | null = null;
  let nextLink: { href: string; title: string } | null = null;

  // Previous link logic (simplified for JS module structure)
  if (currentLessonIndex > 0) {
    const prevLesson = module.lessons[currentLessonIndex - 1];
    prevLink = { href: `/lessons/javascript-essentials/${module.slug}/lesson/${prevLesson.slug}`, title: prevLesson.subTitle };
  } else if (moduleIndex > 0) {
    const prevModule = jsFoundationsModules[moduleIndex - 1];
    if (prevModule) {
      const lastQuiz = prevModule.quizzes?.[prevModule.quizzes.length - 1];
      if (lastQuiz) {
        prevLink = { href: `/lessons/javascript-essentials/${prevModule.slug}/quiz/${lastQuiz.slug}`, title: `Quiz: ${lastQuiz.title}` };
      } else {
        const lastLab = prevModule.labs?.[prevModule.labs.length - 1];
        if (lastLab) {
          prevLink = { href: `/lessons/javascript-essentials/${prevModule.slug}/lab/${lastLab.slug}`, title: `Lab: ${lastLab.title}` };
        } else {
          const lastLessonPrevModule = prevModule.lessons?.[prevModule.lessons.length - 1];
          if (lastLessonPrevModule) {
            prevLink = { href: `/lessons/javascript-essentials/${prevModule.slug}/lesson/${lastLessonPrevModule.slug}`, title: lastLessonPrevModule.subTitle };
          }
        }
      }
    }
  }

  // Next link logic (simplified for JS module structure)
  if (currentLessonIndex < module.lessons.length - 1) {
    const nextLesson = module.lessons[currentLessonIndex + 1];
    nextLink = { href: `/lessons/javascript-essentials/${module.slug}/lesson/${nextLesson.slug}`, title: nextLesson.subTitle };
  } else if (module.labs && module.labs.length > 0) {
    nextLink = { href: `/lessons/javascript-essentials/${module.slug}/lab/${module.labs[0].slug}`, title: `Lab: ${module.labs[0].title}`};
  } else if (module.quizzes && module.quizzes.length > 0) {
     nextLink = { href: `/lessons/javascript-essentials/${module.slug}/quiz/${module.quizzes[0].slug}`, title: `Quiz: ${module.quizzes[0].title}`};
  } else if (moduleIndex < jsFoundationsModules.length - 1) {
     const nextModule = jsFoundationsModules[moduleIndex + 1];
     if (nextModule) {
        const firstLessonNextModule = nextModule.lessons?.[0];
        if (firstLessonNextModule) {
            nextLink = { href: `/lessons/javascript-essentials/${nextModule.slug}/lesson/${firstLessonNextModule.slug}`, title: `Next Module: ${firstLessonNextModule.subTitle}`};
        } // Further nesting for labs/quizzes if lessons are empty can be added
     }
  }
  
  return <JSLessonPageContent lesson={lesson} moduleTitle={module.title} prevLink={prevLink} nextLink={nextLink} />;
}