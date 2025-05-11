
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button"; // For Lab/Quiz links
import Link from "next/link"; // For Lab/Quiz links
import { FlaskConical, HelpCircle, FileText } from "lucide-react"; // Icons

interface LessonItem {
  subTitle: string;
  text: string;
}

interface LabItem { // Define Lab structure
  title: string;
  description: string;
  // link?: string; // Optional: direct link to a lab page
}

interface QuizItem { // Define Quiz structure
  title: string;
  questionsCount: number;
  // link?: string; // Optional: direct link to a quiz page
}

interface LessonModule {
  title: string;
  content: LessonItem[];
  labs?: LabItem[]; // Optional labs array
  quizzes?: QuizItem[]; // Optional quizzes array
}

interface LessonViewerProps {
  lessons: LessonModule[];
}

export default function LessonViewer({ lessons }: LessonViewerProps) {
  if (!lessons || lessons.length === 0) {
    return <p className="text-muted-foreground">No lesson content available yet.</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {lessons.map((module, moduleIndex) => (
        <AccordionItem value={`module-${moduleIndex}`} key={moduleIndex} className="mb-2 border rounded-lg overflow-hidden">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline px-4 py-3 bg-muted/50 hover:bg-muted/70">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {module.title}
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 px-4 py-3 border-t">
            {module.content.map((item, itemIndex) => (
              <div key={itemIndex} className="pt-2 pb-2 border-b border-dashed last:border-b-0">
                <h4 className="font-medium text-md text-primary/90">{item.subTitle}</h4>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
            
            {/* Display Labs for this module */}
            {module.labs && module.labs.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <h5 className="font-semibold text-md mb-2 flex items-center gap-1.5">
                  <FlaskConical className="w-5 h-5 text-green-600" />
                  Labs & Exercises:
                </h5>
                <ul className="space-y-2 pl-2">
                  {module.labs.map((lab, labIndex) => (
                    <li key={labIndex} className="text-sm p-2 bg-green-500/10 rounded-md">
                      <p className="font-medium text-green-700">{lab.title}</p>
                      <p className="text-xs text-muted-foreground">{lab.description}</p>
                      <Button variant="link" size="sm" className="px-0 h-auto text-xs mt-1" disabled>
                        Start Lab (Coming Soon)
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display Quizzes for this module */}
            {module.quizzes && module.quizzes.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <h5 className="font-semibold text-md mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Module Quizzes:
                </h5>
                <ul className="space-y-2 pl-2">
                  {module.quizzes.map((quiz, quizIndex) => (
                    <li key={quizIndex} className="text-sm p-2 bg-blue-500/10 rounded-md">
                      <p className="font-medium text-blue-700">{quiz.title} ({quiz.questionsCount} questions)</p>
                      <Button variant="link" size="sm" className="px-0 h-auto text-xs mt-1" disabled>
                        Start Quiz (Coming Soon)
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
             {( (!module.labs || module.labs.length === 0) && (!module.quizzes || module.quizzes.length === 0) ) && (
                <div className="mt-4 p-3 bg-muted/30 rounded-md">
                    <p className="text-xs text-muted-foreground text-center">No labs or quizzes for this module yet. (Coming Soon)</p>
                </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
