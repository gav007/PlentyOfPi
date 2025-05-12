
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LessonModule } from '@/types/lessons';
import { cn } from '@/lib/utils';
import { BookOpen, FlaskConical, HelpCircle, CheckCircle2 } from 'lucide-react';

interface SidebarTOCProps {
  module: LessonModule;
  currentModuleSlug: string;
}

// Placeholder for progress checking - replace with actual localStorage logic
const isItemCompleted = (itemType: 'lesson' | 'lab' | 'quiz', itemSlug: string): boolean => {
  // For now, assume nothing is completed
  // Example: if (typeof window !== 'undefined') return !!localStorage.getItem(`${itemType}-${itemSlug}-completed`);
  return false; 
};


export default function SidebarTOC({ module, currentModuleSlug }: SidebarTOCProps) {
  const pathname = usePathname();

  const linkClass = (href: string, isCompleted: boolean) =>
    cn(
      'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
      pathname === href
        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
        : 'text-muted-foreground',
      isCompleted && pathname !== href ? 'text-green-600 dark:text-green-400' : '' // Removed line-through for completed items
    );

  return (
    <nav className="space-y-3">
      {module.content && module.content.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground/70 mb-1 pl-3">Lessons</h3>
          <ul className="space-y-0.5">
            {module.content.map((lesson) => {
              const href = `/lessons/python-foundations/${currentModuleSlug}/lesson/${lesson.slug}`;
              const completed = isItemCompleted('lesson', lesson.slug);
              return (
                <li key={lesson.slug}>
                  <Link href={href} className={linkClass(href, completed)}>
                    {completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <BookOpen className="w-4 h-4" />}
                    <span>{lesson.subTitle}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {module.labs && module.labs.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground/70 mb-1 pl-3 mt-3">Labs</h3>
          <ul className="space-y-0.5">
            {module.labs.map((lab) => {
              const href = `/lessons/python-foundations/${currentModuleSlug}/lab/${lab.slug}`;
              const completed = isItemCompleted('lab', lab.slug);
              return (
                <li key={lab.slug}>
                  <Link href={href} className={linkClass(href, completed)}>
                    {completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <FlaskConical className="w-4 h-4" />}
                    <span>{lab.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {module.quizzes && module.quizzes.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground/70 mb-1 pl-3 mt-3">Quizzes</h3>
          <ul className="space-y-0.5">
            {module.quizzes.map((quiz) => {
              const href = `/lessons/python-foundations/${currentModuleSlug}/quiz/${quiz.slug}`;
              const completed = isItemCompleted('quiz', quiz.slug);
              return (
                <li key={quiz.slug}>
                  <Link href={href} className={linkClass(href, completed)}>
                     {completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <HelpCircle className="w-4 h-4" />}
                    <span>{quiz.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
