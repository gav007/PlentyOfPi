
import type { NavItem, FeatureCardItem } from '@/types';
import {
  Home,
  Gamepad2,
  Brain,
  Orbit,
  Puzzle,
  Sigma,
  Calculator as CalculatorIcon, 
  TestTubeDiagonal, 
  Scale,
  BookOpen,
  Settings,
  FileCode, 
  Target, 
  SearchCode, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  FileJson,
  LineChart,
  FunctionSquare,
  Code as CodeIcon, 
  Binary,
  Zap,
  BrainCircuit, 
  BarChartHorizontal, 
  Search, 
  GitFork, 
  Repeat, 
  Users, 
  DraftingCompass, // For Geometry
} from 'lucide-react';

export const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Games',
    href: '#', 
    icon: Gamepad2,
    subItems: [
      {
        title: 'Binary Converter',
        href: '/binary-game',
        icon: Binary, // Changed from Brain for consistency
        description: 'Learn binary with an 8/16-bit interactive game.',
      },
      {
        title: 'Unit Circle Explorer',
        href: '/unit-circle',
        icon: Orbit,
        description: 'Explore angles, radians, and trig functions.',
      },
      {
        title: 'Hex Boxes Challenge',
        href: '/hex-boxes',
        icon: Puzzle,
        description: 'Convert decimal to two-digit hex values.',
      },
      {
        title: 'Fraction Duel',
        href: '/quick-math/fraction-duel',
        icon: TestTubeDiagonal,
        description: 'Test your fraction arithmetic skills in a duel!',
      },
      {
        title: 'Ratio Scales',
        href: '/quick-math/ratio-scales',
        icon: Scale,
        description: 'Balance weights to understand ratios.',
      },
    ],
  },
  {
    title: 'Tools',
    href: '#', 
    icon: Settings, 
    subItems: [
       {
        title: 'Calculus Playground',
        href: '/calculus-playground',
        icon: Sigma,
        description: 'Visualize functions, derivatives, and integrals.',
      },
      {
        title: 'Prime Tester',
        href: '/tools/prime-tester',
        icon: Search, // More fitting than Binary for "testing"
        description: 'Test numbers for primality and find factors.',
      },
      {
        title: 'Math Battle',
        href: '/tools/math-battle',
        icon: Zap,
        description: 'Quick fire math problems against the clock.',
      },
      {
        title: 'Fourier Series Visualizer',
        href: '/tools/fourier-series',
        icon: FunctionSquare, 
        description: 'Explore Fourier series and waveform synthesis.',
      },
      {
        title: 'Algorithm Arena',
        href: '/tools/algorithm-arena',
        icon: BrainCircuit,
        description: 'Explore algorithms interactively.',
        subItems: [ 
          {
            title: 'Sorting Visualizer',
            href: '/tools/algorithm-arena/sorting',
            icon: BarChartHorizontal,
            description: 'Visualize sorting algorithms like Bubble Sort, Merge Sort.',
          },
          {
            title: 'Searching Visualizer',
            href: '/tools/algorithm-arena/searching',
            icon: Search,
            description: 'See how Binary Search and Linear Search work.',
          },
          {
            title: 'Graph Traversal',
            href: '/tools/algorithm-arena/graph-traversal',
            icon: GitFork,
            description: 'Explore BFS, DFS, Dijkstra’s algorithm.',
          },
          {
            title: 'Recursion Visualizer',
            href: '/tools/algorithm-arena/recursion',
            icon: Repeat,
            description: 'Understand Factorial, Fibonacci, Tower of Hanoi.',
          },
        ]
      },
    ],
  },
  {
    title: 'Lessons',
    href: '/lessons', 
    icon: BookOpen,
    disabled: false, 
    subItems: [
      {
        title: 'Python Foundations',
        href: '/lessons/python-foundations',
        icon: FileCode, // Python logo often uses a file/code icon
        description: 'Learn core Python concepts step by step.',
      },
      {
        title: 'JavaScript Essentials',
        href: '/lessons/javascript-essentials',
        icon: CodeIcon, // Generic code icon for JS
        description: 'Master fundamental JavaScript concepts.',
      }
    ]
  },
];

export const featureCards: FeatureCardItem[] = [
  {
    title: 'Binary Converter Game',
    description: 'Master binary numbers with our interactive 8-bit and 16-bit converter game. Toggle bits, see instant decimal and hex conversions, and test your skills in game mode!',
    href: '/binary-game',
    icon: Binary, // Changed from Brain
    ctaLabel: 'Play Now',
  },
  {
    title: 'Python Foundations',
    description: 'Embark on your Python journey! Learn the fundamentals with interactive lessons, a code sandbox, and gamified challenges.',
    href: '/lessons/python-foundations',
    icon: FileCode,
    ctaLabel: 'Start Learning',
  },
   {
    title: 'JavaScript Essentials',
    description: 'Dive into JavaScript! Interactive lessons, a live code sandbox, and practical exercises to build your web development skills.',
    href: '/lessons/javascript-essentials',
    icon: CodeIcon,
    ctaLabel: 'Learn JS',
  },
  {
    title: 'Algorithm Arena',
    description: 'Explore sorting, searching, graph traversal, and recursion with interactive visualizations and simulations. Understand algorithms step-by-step.',
    href: '/tools/algorithm-arena',
    icon: BrainCircuit,
    ctaLabel: 'Explore Arena',
  },
  {
    title: 'Fourier Series Visualizer',
    description: 'Discover how complex periodic functions can be represented as a sum of simple sine waves. Adjust the number of terms and see the approximation change in real-time with animated epicycles.',
    href: '/tools/fourier-series',
    icon: FunctionSquare,
    ctaLabel: 'Visualize Series',
  },
  {
    title: 'Interactive Unit Circle',
    description: 'Explore the unit circle dynamically. Drag the angle, see radians, degrees, and trigonometric values (sin, cos, tan) update in real-time. Visualize the linked sine wave.',
    href: '/unit-circle',
    icon: Orbit,
    ctaLabel: 'Explore Circle',
  },
  {
    title: 'Calculus Playground',
    description: 'Visualize calculus concepts. Input functions, explore graphs, derivatives (as tangent lines), and integrals (area under curve) with an interactive slider and customizable graph bounds.',
    href: '/calculus-playground',
    icon: Sigma,
    ctaLabel: 'Start Plotting',
  },
  {
    title: 'Prime Tester',
    description: 'Test numbers for primality, find their factors, and explore sequences of prime numbers. A great tool for understanding number theory basics.',
    href: '/tools/prime-tester',
    icon: Search, // Using search icon
    ctaLabel: 'Test Primes',
  },
  {
    title: 'Math Battle Game',
    description: 'Challenge your mental math skills! Solve a variety of arithmetic and logic problems against the clock. Improve your speed and accuracy.',
    href: '/tools/math-battle',
    icon: Zap,
    ctaLabel: 'Start Battle',
  },
  {
    title: 'Hex Boxes Challenge',
    description: 'Learn hexadecimal conversion by converting decimal numbers (0-255) to two-digit hex values. Select digits from a grid and test your understanding in challenge or learn mode.',
    href: '/hex-boxes',
    icon: Puzzle,
    ctaLabel: 'Play Hex Game',
  },
  {
    title: 'Fraction Duel',
    description: 'Challenge your fraction arithmetic! Solve expressions by choosing the correct simplified answer from multiple choices. Difficulty increases with each turn.',
    href: '/quick-math/fraction-duel',
    icon: TestTubeDiagonal,
    ctaLabel: 'Start Duel',
  },
  {
    title: 'Ratio Scales',
    description: 'Balance weights on virtual scales to intuitively understand ratios and proportions. Experiment with different weights and see how equivalent ratios are formed.',
    href: '/quick-math/ratio-scales',
    icon: Scale,
    ctaLabel: 'Explore Ratios',
  },
  {
    title: 'Python: Output Match',
    description: 'Match Python code snippets to their correct output. A fun way to test your understanding of Python execution.',
    href: '/lessons/python-foundations/output-match',
    icon: Target,
    isComingSoon: false, 
    ctaLabel: 'Try Challenge',
  },
  {
    title: 'Python: Syntax Spotter',
    description: 'Can you spot the syntax errors? Sharpen your Python debugging skills by identifying mistakes in code.',
    href: '/lessons/python-foundations/syntax-spotter',
    icon: SearchCode,
    isComingSoon: false, 
    ctaLabel: 'Spot Errors',
  },
  {
    title: 'Python: Debug It!', 
    description: 'Fix broken Python code! Apply your knowledge to debug real-world-like scenarios and make the code run.',
    href: '/lessons/python-foundations/debug-it',
    icon: Wrench,
    isComingSoon: false, 
    ctaLabel: 'Debug Code',
  },
  {
    title: 'JS: Output Match',
    description: 'Match JavaScript code snippets to their correct console output. Test your JS execution knowledge.',
    href: '/lessons/javascript-essentials/output-match',
    icon: Target, 
    isComingSoon: false,
    ctaLabel: 'Try JS Challenge',
  },
  {
    title: 'JS: Syntax Spotter',
    description: 'Spot syntax errors in JavaScript code. A great way to improve your attention to detail.',
    href: '/lessons/javascript-essentials/syntax-spotter',
    icon: SearchCode,
    isComingSoon: false,
    ctaLabel: 'Spot JS Errors',
  },
  {
    title: 'JS: Debug It!',
    description: 'Fix buggy JavaScript code! Use the in-browser sandbox to test and correct the snippets.',
    href: '/lessons/javascript-essentials/debug-it',
    icon: Wrench,
    isComingSoon: false,
    ctaLabel: 'Debug JS Code',
  },
];

export const siteConfig = {
  name: "Plenty of π",
  description: "Interactive tools and engaging lessons to make learning math and computer science fun and accessible.",
  url: "https://example.com", // Replace with your actual domain
  ogImage: "https://example.com/og.jpg", // Replace with your actual OG image URL
  links: {
    twitter: "https://twitter.com/example", // Replace with your Twitter if any
    github: "https://github.com/example/plenty-of-pi", // Replace with your GitHub if any
  },
  navItems, 
  featureCards, 
};

export type SiteConfig = typeof siteConfig;
