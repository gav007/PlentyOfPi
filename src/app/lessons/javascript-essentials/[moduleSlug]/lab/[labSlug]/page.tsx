import type { Metadata } from 'next';
import jsFoundationsModules from '@/config/jsFoundationsContent';
import JSLabPageContent from '@/components/javascript-essentials/JSLabPageContent'; // Adjusted import
import { notFound } from 'next/navigation';
import type { JSModule } from '@/types/javascript-lessons';

interface JSLabPageProps {
  params: {
    moduleSlug: string;
    labSlug: string;
  };
}

export async function generateStaticParams() {
  const params: { moduleSlug: string; labSlug: string }[] = [];
  jsFoundationsModules.forEach(module => {
    module.labs?.forEach(lab => {
      params.push({ moduleSlug: module.slug, labSlug: lab.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: JSLabPageProps): Promise<Metadata> {
  const module = jsFoundationsModules.find(m => m.slug === params.moduleSlug);
  const lab = module?.labs?.find(l => l.slug === params.labSlug);

  if (!lab || !module) {
    return {
      title: 'Lab Not Found | Plenty of π',
      description: 'The requested JavaScript lab could not be found.',
    };
  }

  return {
    title: `Lab: ${lab.title} | ${module.title} | Plenty of π`,
    description: `Practice with ${lab.title} in the ${module.title} module of JavaScript Essentials.`,
  };
}

export default function JSLabPage({ params }: JSLabPageProps) {
  const module = jsFoundationsModules.find(m => m.slug === params.moduleSlug);
  const lab = module?.labs?.find(l => l.slug === params.labSlug);

  if (!lab || !module) {
    notFound();
  }
  
  const moduleIndex = jsFoundationsModules.findIndex(m => m.slug === params.moduleSlug);
  const currentLabIndex = module.labs?.findIndex(l => l.slug === params.labSlug) ?? -1;
  
  let prevLink: { href: string; title: string } | null = null;
  let nextLink: { href: string; title: string } | null = null;

  // Previous link logic
  if (currentLabIndex > 0 && module.labs) {
    const prevLab = module.labs[currentLabIndex - 1];
    prevLink = { href: `/lessons/javascript-essentials/${module.slug}/lab/${prevLab.slug}`, title: `Lab: ${prevLab.title}` };
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

  // Next link logic
  if (module.labs && currentLabIndex < module.labs.length - 1) {
    const nextLab = module.labs[currentLabIndex + 1];
    nextLink = { href: `/lessons/javascript-essentials/${module.slug}/lab/${nextLab.slug}`, title: `Lab: ${nextLab.title}` };
  } else if (module.quizzes && module.quizzes.length > 0) { 
    nextLink = { href: `/lessons/javascript-essentials/${module.slug}/quiz/${module.quizzes[0].slug}`, title: `Quiz: ${module.quizzes[0].title}`};
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
  
  return <JSLabPageContent lab={lab} moduleTitle={module.title} prevLink={prevLink} nextLink={nextLink} />;
}
