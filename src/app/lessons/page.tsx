
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileCode, Code as CodeIcon } from 'lucide-react'; // Added CodeIcon
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Lessons | Plenty of π',
  description: 'Explore interactive lessons on math and computer science topics.',
};

export default function LessonsPage() {
  const lessons = [
    {
      title: 'Python Foundations',
      description: 'Learn the fundamentals of Python programming, tailored for beginners. Covers syntax, control flow, data structures, and more.',
      href: '/lessons/python-foundations',
      icon: FileCode,
      imageSrc: 'https://picsum.photos/seed/pythonlessons/600/400',
      imageAlt: 'Python logo and code snippets',
      dataAiHint: 'code',
    },
    {
      title: 'JavaScript Essentials',
      description: 'Master the core concepts of JavaScript, the language of the web. Covers variables, functions, DOM manipulation basics, and modern JS features.',
      href: '/lessons/javascript-essentials',
      icon: CodeIcon, // JS Icon
      imageSrc: 'https://picsum.photos/seed/jslessons/600/400',
      imageAlt: 'JavaScript code examples',
      dataAiHint: 'code',
    },
    // Add more lessons here as they become available
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Explore Our Lessons
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Dive into interactive learning modules designed to make complex topics accessible and engaging.
        </p>
      </header>

      {lessons.length === 0 ? (
        <p className="text-center text-muted-foreground text-xl">
          No lessons available yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson) => (
            <Card key={lesson.title} className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03] overflow-hidden">
              {lesson.imageSrc && (
                <div className="relative w-full h-48">
                  <Image
                    src={lesson.imageSrc}
                    alt={lesson.imageAlt || lesson.title}
                    data-ai-hint={lesson.dataAiHint}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  {lesson.icon && <lesson.icon className="w-8 h-8 text-primary" />}
                  <CardTitle className="text-xl">{lesson.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm leading-relaxed">{lesson.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={lesson.href}>
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
