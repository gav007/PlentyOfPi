
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, Target, SearchCode, Wrench } from 'lucide-react';

const gamifiedActivities = [
  {
    title: 'Output Match Challenge',
    description: 'Test your understanding of Python execution by matching code snippets to their correct output.',
    href: '/lessons/python-foundations/output-match',
    icon: Target,
  },
  {
    title: 'Syntax Spotter Game',
    description: 'Sharpen your Python debugging skills. Find and identify syntax errors in various code examples.',
    href: '/lessons/python-foundations/syntax-spotter',
    icon: SearchCode,
  },
  {
    title: 'Debug It! Puzzles',
    description: 'Become a Python detective! Fix broken code snippets and make them run correctly.',
    href: '/lessons/python-foundations/debug-it',
    icon: Wrench,
  },
];

export default function GamifiedSection() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Reinforce your learning with these interactive challenges and games. (These are currently placeholders for full game functionality but will navigate to a page)
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamifiedActivities.map((activity) => (
          <Card key={activity.title} className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03]">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <activity.icon className="w-7 h-7 text-primary" />
                <CardTitle className="text-lg">{activity.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{activity.description}</CardDescription>
            </CardContent>
            <CardFooter>
              {/* Enable the button and link */}
              <Button asChild variant="outline" className="w-full">
                <Link href={activity.href}>
                  Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
