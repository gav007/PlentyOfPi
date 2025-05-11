
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpenCheck, Info } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingCard() {
  return (
    <Card className="bg-secondary/30 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Info className="w-7 h-7 text-primary" />
          Welcome to Python Foundations!
        </CardTitle>
        <CardDescription className="text-base">
          This module is designed to guide you through the essentials of Python programming, aligning with the PCEP – Certified Entry-Level Python Programmer certification syllabus.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground">
          <strong>Course Goals:</strong>
        </p>
        <ul className="list-disc list-inside pl-5 text-muted-foreground space-y-1">
          <li>Understand fundamental programming concepts.</li>
          <li>Master Python syntax, data types, and control flow.</li>
          <li>Work with common data structures like lists, tuples, and dictionaries.</li>
          <li>Write and debug simple Python programs.</li>
          <li>Build a solid foundation for more advanced Python topics.</li>
        </ul>
        <p className="text-muted-foreground mt-4">
          <strong>PCEP Certification Overview:</strong>
        </p>
        <p className="text-muted-foreground">
          The PCEP certification is a professional credential that measures your ability to accomplish coding tasks related to the essentials of programming in the Python language. It demonstrates that you are familiar with universal computer programming concepts like data types, containers, functions, conditions, loops, as well as Python programming language syntax, semantics, and the runtime environment.
        </p>
        <div className="pt-2">
          <Button asChild variant="link" className="px-0">
            <Link href="https://pythoninstitute.org/pcep" target="_blank" rel="noopener noreferrer">
              Learn more about PCEP Certification <BookOpenCheck className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
