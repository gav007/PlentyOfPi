
import type { Metadata } from 'next';
import pythonFoundationsModules from '@/config/pythonFoundationsContent';
import LabPageContent from '@/components/python-foundations/LabPageContent';
import { notFound } from 'next/navigation';

interface PythonLabPageProps {
  params: {
    moduleSlug: string;
    labSlug: string;
  };
}

export async function generateStaticParams() {
  const params: { moduleSlug: string; labSlug: string }[] = [];
  pythonFoundationsModules.forEach(module => {
    module.labs?.forEach(lab => {
      params.push({ moduleSlug: module.slug, labSlug: lab.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: PythonLabPageProps): Promise<Metadata> {
  const module = pythonFoundationsModules.find(m => m.slug === params.moduleSlug);
  const lab = module?.labs?.find(l => l.slug === params.labSlug);

  if (!lab || !module) {
    return {
      title: 'Lab Not Found | Plenty of π',
      description: 'The requested Python lab could not be found.',
    };
  }

  return {
    title: `Lab: ${lab.title} | ${module.title} | Plenty of π`,
    description: `Practice with ${lab.title} in the ${module.title} module of Python Foundations.`,
  };
}

export default function PythonLabPage({ params }: PythonLabPageProps) {
  const module = pythonFoundationsModules.find(m => m.slug === params.moduleSlug);
  const lab = module?.labs?.find(l => l.slug === params.labSlug);

  if (!lab || !module) {
    notFound();
  }
  
  const moduleIndex = pythonFoundationsModules.findIndex(m => m.slug === params.moduleSlug);
  const currentLabIndex = module.labs?.findIndex(l => l.slug === params.labSlug) ?? -1;
  
  let prevLink: { href: string; title: string } | null = null;
  let nextLink: { href: string; title: string } | null = null;

  // Previous link logic
  if (currentLabIndex > 0 && module.labs) {
    const prevLab = module.labs[currentLabIndex - 1];
    prevLink = { href: `/lessons/python-foundations/${module.slug}/lab/${prevLab.slug}`, title: `Lab: ${prevLab.title}` };
  } else { // Link to last lesson of current module
    const lastLesson = module.content[module.content.length - 1];
    if (lastLesson) {
      prevLink = { href: `/lessons/python-foundations/${module.slug}/lesson/${lastLesson.slug}`, title: lastLesson.subTitle };
    } else if (moduleIndex > 0) { // Fallback to previous module's last item (complex, simplified for now)
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

  // Next link logic
  if (module.labs && currentLabIndex < module.labs.length - 1) {
    const nextLab = module.labs[currentLabIndex + 1];
    nextLink = { href: `/lessons/python-foundations/${module.slug}/lab/${nextLab.slug}`, title: `Lab: ${nextLab.title}` };
  } else if (module.quizzes && module.quizzes.length > 0) { // Link to first quiz of current module
    nextLink = { href: `/lessons/python-foundations/${module.slug}/quiz/${module.quizzes[0].slug}`, title: `Quiz: ${module.quizzes[0].title}`};
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
  
  return <LabPageContent lab={lab} moduleTitle={module.title} prevLink={prevLink} nextLink={nextLink} />;
}
