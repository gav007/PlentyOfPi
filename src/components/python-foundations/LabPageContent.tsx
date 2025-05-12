
'use client';

import type { LabItem } from '@/types/lessons';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Code, ListChecks, Lightbulb, BookCheck } from 'lucide-react';
import PythonSandbox from '@/components/python-foundations/PythonSandbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LabPageContentProps {
  lab: LabItem;
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
          return !inline && match ? (
             <pre className="bg-gray-800 text-white p-3 my-3 rounded-md overflow-x-auto text-xs"><code className={className} {...props}>{children}</code></pre>
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

export default function LabPageContent({ lab, moduleTitle, prevLink, nextLink }: LabPageContentProps) {
  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardDescription className="text-sm text-primary">{moduleTitle}</CardDescription>
        <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Code className="w-7 h-7" /> Lab: {lab.title}
        </CardTitle>
        <CardDescription className="mt-1"><MarkdownRenderer text={lab.description} /></CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-6 space-y-6">
        
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
            <TabsTrigger value="tasks" className="flex items-center gap-1.5"><ListChecks className="w-4 h-4" />Tasks</TabsTrigger>
            {lab.hints && lab.hints.length > 0 && <TabsTrigger value="hints" className="flex items-center gap-1.5"><Lightbulb className="w-4 h-4" />Hints</TabsTrigger>}
            {lab.solutionCode && <TabsTrigger value="solution" className="flex items-center gap-1.5"><BookCheck className="w-4 h-4" />Solution</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="tasks" className="mt-4 p-4 border rounded-md bg-muted/20">
            <h3 className="text-lg font-semibold mb-3">Tasks to Complete:</h3>
            {lab.tasks && lab.tasks.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 pl-4 text-sm">
                {lab.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No specific tasks listed. Follow the main lab description.</p>
            )}
          </TabsContent>

          {lab.hints && lab.hints.length > 0 && (
            <TabsContent value="hints" className="mt-4 p-4 border rounded-md bg-muted/20">
              <h3 className="text-lg font-semibold mb-3">Hints:</h3>
              <ul className="list-disc list-inside space-y-2 pl-4 text-sm">
                {lab.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </TabsContent>
          )}

          {lab.solutionCode && (
             <TabsContent value="solution" className="mt-4 p-4 border rounded-md bg-muted/20 space-y-3">
                <h3 className="text-lg font-semibold">Example Solution:</h3>
                <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-xs">
                  <code>{lab.solutionCode}</code>
                </pre>
                {lab.solutionExplanation && (
                  <div>
                    <h4 className="text-md font-semibold mt-2 mb-1">Explanation:</h4>
                    <MarkdownRenderer text={lab.solutionExplanation} />
                  </div>
                )}
            </TabsContent>
          )}
        </Tabs>

        <div>
          <h3 className="text-xl font-semibold mb-3 mt-6 text-primary">Python Sandbox</h3>
          <PythonSandbox />
        </div>

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
      </CardContent>
    </Card>
  );
}
