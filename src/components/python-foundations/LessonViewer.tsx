
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LessonItem {
  subTitle: string;
  text: string;
}

interface LessonModule {
  title: string;
  content: LessonItem[];
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
        <AccordionItem value={`module-${moduleIndex}`} key={moduleIndex}>
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            {module.title}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pl-4 border-l-2 border-primary ml-2">
            {module.content.map((item, itemIndex) => (
              <div key={itemIndex} className="pt-2">
                <h4 className="font-medium text-md text-primary/90">{item.subTitle}</h4>
                {/* In a real scenario, this 'text' would be markdown rendered to HTML */}
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{item.text}</p>
              </div>
            ))}
            {/* Placeholder for auto-graded labs */}
            <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <p className="font-semibold text-sm">Labs & Exercises:</p>
                <p className="text-xs text-muted-foreground">Interactive labs for this module will appear here. (Coming Soon)</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
