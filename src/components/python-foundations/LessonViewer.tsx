
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FlaskConical, HelpCircle, FileText, Code, ChevronRight, ListChecks, Brain } from "lucide-react"; // Icons
import type { LessonModule, LabItem, QuizItem } from '@/types/lessons'; 
import ReactMarkdown from 'react-markdown'; 

interface LessonViewerProps {
  // This component might be refactored to display a single lesson's content
  // or a list of lessons within a module, rather than all modules.
  // For now, let's assume it's used for a single module's content list if needed,
  // or it's replaced by individual page components.
  module?: LessonModule; // Make module optional or change prop structure
  lessons?: LessonModule[]; // If it's still for multiple modules (less likely now)
}

// Simple component to render markdown, can be expanded later
const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  return (
    <ReactMarkdown
      className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
      components={{
        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc list-inside pl-4 mb-2 space-y-1" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal list-inside pl-4 mb-2 space-y-1" {...props} />,
        code: ({node, inline, className, children, ...props}) => {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
             <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-xs my-2"><code className={className} {...props}>{children}</code></pre>
          ) : (
            <code className="bg-muted/50 text-primary px-1 py-0.5 rounded-sm text-xs" {...props}>{children}</code>
          )
        },
        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
};


export default function LessonViewer({ module, lessons }: LessonViewerProps) {
  // This component's role is changing due to the new page structure.
  // It's unlikely to be used in the same way.
  // For now, it can remain as a reference or be adapted later if needed
  // for a specific view (e.g., listing items within a module if not using SidebarTOC for that).

  if (!module && (!lessons || lessons.length === 0)) {
    return <p className="text-muted-foreground">No lesson content specified for viewer.</p>;
  }

  const modulesToDisplay = module ? [module] : lessons || [];


  // TODO: Implement actual quiz UI and logic later. For now, display questions.
  const renderQuiz = (quiz: QuizItem, moduleSlug: string) => (
    <div className="mt-3 p-3 border border-blue-500/30 bg-blue-500/10 rounded-md">
      <h6 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1.5">
        <ListChecks className="w-4 h-4"/> {quiz.title} ({quiz.questionsCount} questions)
      </h6>
      {/* Link to the new quiz page */}
      <Button asChild variant="link" size="sm" className="px-0 h-auto text-xs mt-2 text-blue-600 hover:text-blue-700">
        <Link href={`/lessons/python-foundations/${moduleSlug}/quiz/${quiz.slug}`}>
          Go to Quiz <ChevronRight className="w-3 h-3 ml-1"/>
        </Link>
      </Button>
    </div>
  );

  const renderLab = (lab: LabItem, moduleSlug: string) => (
    <div className="mt-3 p-3 border border-green-500/30 bg-green-500/10 rounded-md">
      <h6 className="font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1.5">
        <FlaskConical className="w-4 h-4" /> Lab: {lab.title}
      </h6>
      <MarkdownRenderer text={lab.description} />
      {/* Link to the new lab page */}
      <Button asChild variant="link" size="sm" className="px-0 h-auto text-xs mt-2 text-green-600 hover:text-green-700">
        <Link href={`/lessons/python-foundations/${moduleSlug}/lab/${lab.slug}`}>
          Go to Lab <ChevronRight className="w-3 h-3 ml-1"/>
        </Link>
      </Button>
    </div>
  );

  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {modulesToDisplay.map((currentModule, moduleIndex) => (
        <AccordionItem value={`module-${moduleIndex}`} key={moduleIndex} className="border rounded-lg overflow-hidden shadow-sm bg-card">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 text-primary/90">
              <FileText className="w-5 h-5" />
              {currentModule.title}
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-4 py-3 border-t bg-background">
            {currentModule.content.map((item, itemIndex) => (
              <div key={itemIndex} className="pt-2 pb-3 border-b border-dashed last:border-b-0">
                <h4 className="font-medium text-md text-primary mb-1 flex items-center gap-1.5">
                   <Brain className="w-4 h-4" /> 
                   {/* Link to the new lesson page */}
                   <Link href={`/lessons/python-foundations/${currentModule.slug}/lesson/${item.slug}`} className="hover:underline">
                    {item.subTitle}
                   </Link>
                </h4>
                <MarkdownRenderer text={item.text.substring(0, 150) + (item.text.length > 150 ? '...' : '')} />
                 <Button asChild variant="link" size="sm" className="px-0 h-auto text-xs mt-1">
                    <Link href={`/lessons/python-foundations/${currentModule.slug}/lesson/${item.slug}`}>
                        Read More <ChevronRight className="w-3 h-3 ml-1"/>
                    </Link>
                 </Button>
              </div>
            ))}
            
            {currentModule.labs && currentModule.labs.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                {currentModule.labs.map((lab, labIndex) => (
                  <div key={labIndex} className="mb-3 last:mb-0">{renderLab(lab, currentModule.slug)}</div>
                ))}
              </div>
            )}

            {currentModule.quizzes && currentModule.quizzes.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                 {currentModule.quizzes.map((quiz, quizIndex) => (
                  <div key={quizIndex} className="mb-3 last:mb-0">{renderQuiz(quiz, currentModule.slug)}</div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
