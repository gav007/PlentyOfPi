'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { JSModule } from '@/types/javascript-lessons'; // Adjusted import
import { cn } from '@/lib/utils';
import { BookOpen, FlaskConical, HelpCircle, CheckCircle2, CodeSquare } from 'lucide-react'; // CodeSquare for JS

interface JSSidebarTOCProps {
  module: JSModule;
  currentModuleSlug: string;
}

// Placeholder for progress checking - replace with actual localStorage logic
const isJSItemCompleted = (itemType: 'lesson' | 'lab' | 'quiz', itemSlug: string): boolean => {
  // if (typeof window !== 'undefined') return !!localStorage.getItem(`js-${itemType}-${itemSlug}-completed`);
  return false; 
};

export default function JSSidebarTOC({ module, currentModuleSlug }: JSSidebarTOCProps) {
  const pathname = usePathname();

  const linkClass = (href: string, isCompleted: boolean) =>
    cn(
      'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
      pathname === href
        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
        : 'text-muted-foreground',
      isCompleted && pathname !== href ? 'text-green-600 dark:text-green-400' : ''
    );

  return (
    <nav className="space-y-3">
      {module.lessons && module.lessons.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground/70 mb-1 pl-3">Lessons</h3>
          <ul className="space-y-0.5">
            {module.lessons.map((lesson) => {
              const href = `/lessons/javascript-essentials/${currentModuleSlug}/lesson/${lesson.slug}`;
              const completed = isJSItemCompleted('lesson', lesson.slug);
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
              const href = `/lessons/javascript-essentials/${currentModuleSlug}/lab/${lab.slug}`;
              const completed = isJSItemCompleted('lab', lab.slug);
              return (
                <li key={lab.slug}>
                  <Link href={href} className={linkClass(href, completed)}>
                    {completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <CodeSquare className="w-4 h-4 text-yellow-600" />} {/* JS Lab Icon */}
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
              const href = `/lessons/javascript-essentials/${currentModuleSlug}/quiz/${quiz.slug}`;
              const completed = isJSItemCompleted('quiz', quiz.slug);
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
