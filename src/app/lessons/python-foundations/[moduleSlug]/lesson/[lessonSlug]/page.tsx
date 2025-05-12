
import type { Metadata } from 'next';
import pythonFoundationsModules from '@/config/pythonFoundationsContent';
import LessonPageContent from '@/components/python-foundations/LessonPageContent';
import { notFound } from 'next/navigation';

interface PythonLessonPageProps {
  params: {
    moduleSlug: string;
    lessonSlug: string;
  };
}

export async function generateStaticParams() {
  const params: { moduleSlug: string; lessonSlug: string }[] = [];
  pythonFoundationsModules.forEach(module => {
    module.content.forEach(lesson => {
      params.push({ moduleSlug: module.slug, lessonSlug: lesson.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: PythonLessonPageProps): Promise<Metadata> {
  const module = pythonFoundationsModules.find(m => m.slug === params.moduleSlug);
  const lesson = module?.content.find(l => l.slug === params.lessonSlug);

  if (!lesson || !module) {
    return {
      title: 'Lesson Not Found | Plenty of π',
      description: 'The requested Python lesson could not be found.',
    };
  }

  return {
    title: `${lesson.subTitle} | ${module.title} | Plenty of π`,
    description: `Learn about ${lesson.subTitle} in the ${module.title} of Python Foundations.`,
  };
}

export default function PythonLessonPage({ params }: PythonLessonPageProps) {
  const module = pythonFoundationsModules.find(m => m.slug === params.moduleSlug);
  const lesson = module?.content.find(l => l.slug === params.lessonSlug);

  if (!lesson || !module) {
    notFound();
  }
  
  const moduleIndex = pythonFoundationsModules.findIndex(m => m.slug === params.moduleSlug);
  const currentLessonIndex = module.content.findIndex(l => l.slug === params.lessonSlug);
  
  let prevLink: { href: string; title: string } | null = null;
  let nextLink: { href: string; title: string } | null = null;

  // Previous link logic
  if (currentLessonIndex > 0) {
    const prevLesson = module.content[currentLessonIndex - 1];
    prevLink = { href: `/lessons/python-foundations/${module.slug}/lesson/${prevLesson.slug}`, title: prevLesson.subTitle };
  } else if (moduleIndex > 0) { // Link to last item of previous module
    const prevModule = pythonFoundationsModules[moduleIndex - 1];
    if (prevModule) {
      const lastQuiz = prevModule.quizzes?.[prevModule.quizzes.length - 1];
      if (lastQuiz) {
        prevLink = { href: `/lessons/python-foundations/${prevModule.slug}/quiz/${lastQuiz.slug}`, title: `Quiz: ${lastQuiz.title}` };
      } else {
        const lastLab = prevModule.labs?.[prevModule.labs.length - 1];
        if (lastLab) {
          prevLink = { href: `/lessons/python-foundations/${prevModule.slug}/lab/${lastLab.slug}`, title: `Lab: ${lastLab.title}` };
        } else {
          const lastLessonPrevModule = prevModule.content?.[prevModule.content.length - 1];
          if (lastLessonPrevModule) {
            prevLink = { href: `/lessons/python-foundations/${prevModule.slug}/lesson/${lastLessonPrevModule.slug}`, title: lastLessonPrevModule.subTitle };
          }
        }
      }
    }
  }

  // Next link logic
  if (currentLessonIndex < module.content.length - 1) {
    const nextLesson = module.content[currentLessonIndex + 1];
    nextLink = { href: `/lessons/python-foundations/${module.slug}/lesson/${nextLesson.slug}`, title: nextLesson.subTitle };
  } else if (module.labs && module.labs.length > 0) { // Link to first lab of current module
    nextLink = { href: `/lessons/python-foundations/${module.slug}/lab/${module.labs[0].slug}`, title: `Lab: ${module.labs[0].title}`};
  } else if (module.quizzes && module.quizzes.length > 0) { // Link to first quiz of current module
     nextLink = { href: `/lessons/python-foundations/${module.slug}/quiz/${module.quizzes[0].slug}`, title: `Quiz: ${module.quizzes[0].title}`};
  } else if (moduleIndex < pythonFoundationsModules.length - 1) { // Link to next module's first item
     const nextModule = pythonFoundationsModules[moduleIndex + 1];
     if (nextModule) {
        const firstLessonNextModule = nextModule.content?.[0];
        if (firstLessonNextModule) {
            nextLink = { href: `/lessons/python-foundations/${nextModule.slug}/lesson/${firstLessonNextModule.slug}`, title: `Next Module: ${firstLessonNextModule.subTitle}`};
        } else {
            const firstLabNextModule = nextModule.labs?.[0];
            if (firstLabNextModule) {
                 nextLink = { href: `/lessons/python-foundations/${nextModule.slug}/lab/${firstLabNextModule.slug}`, title: `Next Module: Lab: ${firstLabNextModule.title}`};
            } else {
                const firstQuizNextModule = nextModule.quizzes?.[0];
                 if (firstQuizNextModule) {
                     nextLink = { href: `/lessons/python-foundations/${nextModule.slug}/quiz/${firstQuizNextModule.slug}`, title: `Next Module: Quiz: ${firstQuizNextModule.title}`};
                 }
            }
        }
     }
  }
  
  return <LessonPageContent lesson={lesson} moduleTitle={module.title} prevLink={prevLink} nextLink={nextLink} />;
}
