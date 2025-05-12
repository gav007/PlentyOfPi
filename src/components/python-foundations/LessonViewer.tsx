
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FlaskConical, HelpCircle, FileText, Code, ChevronRight, ListChecks, Brain } from "lucide-react"; // Icons
import type { LessonModule, LabItem, QuizItem, QuizQuestion } from '@/types/lessons'; // Import refined types
import ReactMarkdown from 'react-markdown'; // For rendering markdown content in lesson text

interface LessonViewerProps {
  lessons: LessonModule[];
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


export default function LessonViewer({ lessons }: LessonViewerProps) {
  if (!lessons || lessons.length === 0) {
    return <p className="text-muted-foreground">No lesson content available yet.</p>;
  }

  // TODO: Implement actual quiz UI and logic later. For now, display questions.
  const renderQuiz = (quiz: QuizItem) => (
    <div className="mt-3 p-3 border border-blue-500/30 bg-blue-500/10 rounded-md">
      <h6 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1.5">
        <ListChecks className="w-4 h-4"/> {quiz.title} ({quiz.questionsCount} questions)
      </h6>
      <ul className="space-y-2 text-xs list-decimal list-inside pl-2">
        {quiz.questions.map((q, idx) => (
          <li key={idx} className="text-muted-foreground">
            {q.question}
            <ul className="list-disc list-inside pl-4 mt-1">
              {Object.entries(q.options).map(([key, option]) => (
                <li key={key} className={q.answer === key ? "font-medium text-primary/90" : ""}>({key}) {option}</li>
              ))}
            </ul>
             <p className="text-xs text-primary/70 mt-0.5 italic">Correct Answer: {q.answer}. {q.feedback}</p>
          </li>
        ))}
      </ul>
      <Button variant="link" size="sm" className="px-0 h-auto text-xs mt-2 text-blue-600 hover:text-blue-700" disabled>
        Take Interactive Quiz (Coming Soon) <ChevronRight className="w-3 h-3 ml-1"/>
      </Button>
    </div>
  );

  const renderLab = (lab: LabItem) => (
    <div className="mt-3 p-3 border border-green-500/30 bg-green-500/10 rounded-md">
      <h6 className="font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1.5">
        <FlaskConical className="w-4 h-4" /> Lab: {lab.title}
      </h6>
      <MarkdownRenderer text={lab.description} />
      {lab.starterCode && (
        <div className="mt-2">
          <p className="text-xs font-medium text-muted-foreground mb-1">Starter Code:</p>
          <pre className="bg-gray-800 text-white p-2 rounded-md overflow-x-auto text-xs"><code>{lab.starterCode}</code></pre>
        </div>
      )}
      {lab.tasks && lab.tasks.length > 0 && (
         <div className="mt-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">Tasks:</p>
            <ul className="list-disc list-inside pl-4 text-xs text-muted-foreground space-y-0.5">
                {lab.tasks.map((task, i) => <li key={i}>{task}</li>)}
            </ul>
         </div>
      )}
      {lab.hints && lab.hints.length > 0 && (
         <div className="mt-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">Hints:</p>
            <ul className="list-disc list-inside pl-4 text-xs text-muted-foreground/80 space-y-0.5">
                {lab.hints.map((hint, i) => <li key={i}>{hint}</li>)}
            </ul>
         </div>
      )}
      <Button variant="link" size="sm" className="px-0 h-auto text-xs mt-2 text-green-600 hover:text-green-700" disabled>
        Open in Sandbox (Coming Soon) <ChevronRight className="w-3 h-3 ml-1"/>
      </Button>
    </div>
  );

  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {lessons.map((module, moduleIndex) => (
        <AccordionItem value={`module-${moduleIndex}`} key={moduleIndex} className="border rounded-lg overflow-hidden shadow-sm bg-card">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 text-primary/90">
              <FileText className="w-5 h-5" />
              {module.title}
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-4 py-3 border-t bg-background">
            {module.content.map((item, itemIndex) => (
              <div key={itemIndex} className="pt-2 pb-3 border-b border-dashed last:border-b-0">
                <h4 className="font-medium text-md text-primary mb-1 flex items-center gap-1.5">
                   <Brain className="w-4 h-4" /> {/* Simple icon for subtitle */}
                   {item.subTitle}
                </h4>
                <MarkdownRenderer text={item.text} />
              </div>
            ))}
            
            {module.labs && module.labs.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                {module.labs.map((lab, labIndex) => (
                  <div key={labIndex} className="mb-3 last:mb-0">{renderLab(lab)}</div>
                ))}
              </div>
            )}

            {module.quizzes && module.quizzes.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                 {module.quizzes.map((quiz, quizIndex) => (
                  <div key={quizIndex} className="mb-3 last:mb-0">{renderQuiz(quiz)}</div>
                ))}
              </div>
            )}
            
             {( (!module.labs || module.labs.length === 0) && (!module.quizzes || module.quizzes.length === 0) ) && (
                <div className="mt-4 p-3 bg-muted/20 rounded-md">
                    <p className="text-xs text-muted-foreground text-center italic">No specific labs or quizzes for this lesson section yet. Check back soon!</p>
                </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

    