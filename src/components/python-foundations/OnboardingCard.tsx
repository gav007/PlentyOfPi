
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
          This module is designed to guide you through the essentials of Python programming, step by step.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground">
          <strong>Module Goals:</strong>
        </p>
        <ul className="list-disc list-inside pl-5 text-muted-foreground space-y-1">
          <li>Understand fundamental programming concepts.</li>
          <li>Master Python syntax, data types, and control flow.</li>
          <li>Work with common data structures like lists, tuples, and dictionaries.</li>
          <li>Write and debug simple Python programs.</li>
          <li>Build a solid foundation for more advanced Python topics and real-world applications.</li>
        </ul>
        <p className="text-muted-foreground mt-4">
          <strong>Why Learn Python?</strong>
        </p>
        <p className="text-muted-foreground">
          Python is a versatile and widely-used language in many fields, including web development, data science, artificial intelligence, automation, and scientific computing. Its readability makes it an excellent choice for beginners and a powerful tool for experienced developers.
        </p>
        <div className="pt-2">
          <Button asChild variant="link" className="px-0">
            <Link href="https://www.python.org/about/" target="_blank" rel="noopener noreferrer">
              Learn more about Python <BookOpenCheck className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
