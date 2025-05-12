
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChartHorizontal, Search, GitFork, Repeat, Users, BrainCircuit } from 'lucide-react';
import Image from 'next/image';

interface ArenaTool {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  imageSrc: string;
  imageAlt: string;
  dataAiHint: string;
}

const arenaTools: ArenaTool[] = [
  {
    title: 'Sorting Visualizer',
    description: 'Watch sorting algorithms like Bubble Sort and Merge Sort in action. Understand how they organize data step-by-step.',
    href: '/tools/algorithm-arena/sorting',
    icon: BarChartHorizontal,
    imageSrc: 'https://picsum.photos/seed/sortingalgo/600/400',
    imageAlt: 'Abstract representation of bars being sorted',
    dataAiHint: 'logic symbols',
  },
  {
    title: 'Searching Visualizer',
    description: 'See how Linear Search and Binary Search efficiently find elements in datasets. Compare their performance visually.',
    href: '/tools/algorithm-arena/searching',
    icon: Search,
    imageSrc: 'https://picsum.photos/seed/searchingalgo/600/400',
    imageAlt: 'Magnifying glass over a data array',
    dataAiHint: 'logic symbols',
  },
  {
    title: 'Graph Traversal',
    description: 'Explore graph structures with Breadth-First Search (BFS), Depth-First Search (DFS), and pathfinding algorithms like Dijkstra\'s.',
    href: '/tools/algorithm-arena/graph-traversal',
    icon: GitFork,
    imageSrc: 'https://picsum.photos/seed/graphalgo/600/400',
    imageAlt: 'Network of connected nodes representing a graph',
    dataAiHint: 'math symbols',
  },
  {
    title: 'Recursion Visualizer',
    description: 'Understand recursive concepts like Factorial, Fibonacci sequence, and the Tower of Hanoi puzzle through step-by-step animations.',
    href: '/tools/algorithm-arena/recursion',
    icon: Repeat,
    imageSrc: 'https://picsum.photos/seed/recursionalgo/600/400',
    imageAlt: 'Recursive pattern or fractal design',
    dataAiHint: 'logic symbols',
  },
  {
    title: 'Game Theory Playground',
    description: 'Simulate classic game theory scenarios like the Prisoner\'s Dilemma. Test strategies and visualize payoff matrices.',
    href: '/tools/algorithm-arena/game-theory',
    icon: Users,
    imageSrc: 'https://picsum.photos/seed/gametheory/600/400',
    imageAlt: 'Abstract representation of strategic decision-making',
    dataAiHint: 'math logic',
  },
];

export default function AlgorithmArenaDashboard() {
  return (
    <>
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl flex items-center justify-center gap-3">
          <BrainCircuit className="w-10 h-10" />
          Algorithm Arena
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Dive into the world of algorithms! Visualize how they work, understand their logic, and explore strategic scenarios in game theory.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {arenaTools.map((tool) => (
          <Card key={tool.title} className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03] overflow-hidden">
            <div className="relative w-full h-48">
              <Image
                src={tool.imageSrc}
                alt={tool.imageAlt}
                data-ai-hint={tool.dataAiHint}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <tool.icon className="w-8 h-8 text-primary" />
                <CardTitle className="text-xl">{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={tool.href}>
                  Explore Tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
