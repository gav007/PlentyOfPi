'use client';

import type { JSLessonItem } from '@/types/javascript-lessons'; // Adjusted import
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Code } from 'lucide-react'; // Using Code icon for JS

interface JSLessonPageContentProps {
  lesson: JSLessonItem;
  moduleTitle: string;
  prevLink: { href: string; title: string } | null;
  nextLink: { href: string; title: string } | null;
}

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  return (
    <ReactMarkdown
      className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
      components={{
        p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc list-inside pl-4 mb-3 space-y-1.5" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal list-inside pl-4 mb-3 space-y-1.5" {...props} />,
        code: ({node, inline, className, children, ...props}) => {
          const match = /language-(\w+)/.exec(className || '')
          // For JS, we might want to highlight as 'javascript' or 'js'
          const isJavaScript = match && (match[1] === 'javascript' || match[1] === 'js' || match[1] === 'html');
          return !inline && match ? (
             <pre className={`bg-gray-800 text-white p-3 my-3 rounded-md overflow-x-auto text-xs ${isJavaScript ? 'language-javascript' : ''}`}><code className={className} {...props}>{children}</code></pre>
          ) : (
            <code className="bg-muted/70 text-primary px-1.5 py-0.5 rounded-sm text-xs font-semibold" {...props}>{children}</code>
          )
        },
        strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-primary mt-4 mb-2" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-primary mt-3 mb-1.5" {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export default function JSLessonPageContent({ lesson, moduleTitle, prevLink, nextLink }: JSLessonPageContentProps) {
  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardDescription className="text-sm text-primary">{moduleTitle}</CardDescription>
        <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Code className="w-7 h-7 text-yellow-500" /> {/* JS often associated with yellow */}
          {lesson.subTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <MarkdownRenderer text={lesson.text} />

        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          {prevLink ? (
            <Button asChild variant="outline" size="sm">
              <Link href={prevLink.href}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Prev: {prevLink.title.substring(0,20)}{prevLink.title.length > 20 ? '...' : ''}
              </Link>
            </Button>
          ) : (
            <div /> 
          )}
          {nextLink ? (
            <Button asChild variant="default" size="sm">
              <Link href={nextLink.href}>
                Next: {nextLink.title.substring(0,20)}{nextLink.title.length > 20 ? '...' : ''} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
             <Button asChild variant="default" size="sm">
                <Link href={`/lessons/javascript-essentials/`}>
                    Module Overview <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
