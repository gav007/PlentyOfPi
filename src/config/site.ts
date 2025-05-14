
import type { NavItem, FeatureCardItem } from '@/types';
import {
  Home,
  Gamepad2,
  Orbit,
  Puzzle,
  Sigma,
  Calculator as CalculatorIcon, 
  TestTubeDiagonal, 
  BookOpen,
  Settings,
  FileCode, 
  Target, 
  SearchCode, 
  Wrench, 
  LineChart,
  FunctionSquare,
  Code as CodeIcon, 
  Binary,
  Zap,
  Search, 
  DraftingCompass, 
  Repeat,
  Users,
  Pi,
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
        icon: Binary, 
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
    ],
  },
  {
    title: 'Tools',
    href: '#', 
    icon: Settings, 
    subItems: [
      {
        title: 'Graphify Calculator',
        href: '/graphify', 
        icon: Pi, 
        description: 'Advanced interactive graphing calculator.',
      },
       {
        title: 'Prime Tester',
        href: '/tools/prime-tester',
        icon: Search, 
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
        icon: FileCode, 
        description: 'Learn core Python concepts step by step.',
      },
      {
        title: 'JavaScript Essentials',
        href: '/lessons/javascript-essentials',
        icon: CodeIcon, 
        description: 'Master fundamental JavaScript concepts.',
      }
    ]
  },
];

export const featureCards: FeatureCardItem[] = [
  {
    title: 'Graphify Calculator',
    description: 'Plot multiple functions, explore graphs with interactive zoom/pan, and visualize equations in real-time with our advanced graphing calculator.',
    href: '/graphify',
    icon: Pi, 
    ctaLabel: 'Launch Calculator',
    dataAiHint: 'graph plot'
  },
  {
    title: 'Binary Converter Game',
    description: 'Master binary numbers with our interactive 8-bit and 16-bit converter game. Toggle bits, see instant decimal and hex conversions, and test your skills in game mode!',
    href: '/binary-game',
    icon: Binary, 
    ctaLabel: 'Play Now',
    dataAiHint: 'binary code'
  },
  {
    title: 'Python Foundations',
    description: 'Embark on your Python journey! Learn the fundamentals with interactive lessons, a code sandbox, and gamified challenges.',
    href: '/lessons/python-foundations',
    icon: FileCode,
    ctaLabel: 'Start Learning',
    dataAiHint: 'python code'
  },
   {
    title: 'JavaScript Essentials',
    description: 'Dive into JavaScript! Interactive lessons, a live code sandbox, and practical exercises to build your web development skills.',
    href: '/lessons/javascript-essentials',
    icon: CodeIcon,
    ctaLabel: 'Learn JS',
    dataAiHint: 'javascript code'
  },
  {
    title: 'Fourier Series Visualizer',
    description: 'Discover how complex periodic functions can be represented as a sum of simple sine waves. Adjust the number of terms and see the approximation change in real-time with animated epicycles.',
    href: '/tools/fourier-series',
    icon: FunctionSquare,
    ctaLabel: 'Visualize Series',
    dataAiHint: 'math graph'
  },
  {
    title: 'Interactive Unit Circle',
    description: 'Explore the unit circle dynamically. Drag the angle, see radians, degrees, and trigonometric values (sin, cos, tan) update in real-time. Visualize the linked sine wave.',
    href: '/unit-circle',
    icon: Orbit,
    ctaLabel: 'Explore Circle',
    dataAiHint: 'math circle'
  },
  {
    title: 'Prime Tester',
    description: 'Test numbers for primality, find their factors, and explore sequences of prime numbers. A great tool for understanding number theory basics.',
    href: '/tools/prime-tester',
    icon: Search, 
    ctaLabel: 'Test Primes',
    dataAiHint: 'numbers math'
  },
  {
    title: 'Math Battle Game',
    description: 'Challenge your mental math skills! Solve a variety of arithmetic and logic problems against the clock. Improve your speed and accuracy.',
    href: '/tools/math-battle',
    icon: Zap,
    ctaLabel: 'Start Battle',
    dataAiHint: 'math game'
  },
  {
    title: 'Hex Boxes Challenge',
    description: 'Learn hexadecimal conversion by converting decimal numbers (0-255) to two-digit hex values. Select digits from a grid and test your understanding in challenge or learn mode.',
    href: '/hex-boxes',
    icon: Puzzle,
    ctaLabel: 'Play Hex Game',
    dataAiHint: 'hex code'
  },
  {
    title: 'Fraction Duel',
    description: 'Challenge your fraction arithmetic! Solve expressions by choosing the correct simplified answer from multiple choices. Difficulty increases with each turn.',
    href: '/quick-math/fraction-duel',
    icon: TestTubeDiagonal,
    ctaLabel: 'Start Duel',
    dataAiHint: 'math fractions'
  },
  {
    title: 'Python: Output Match',
    description: 'Match Python code snippets to their correct output. A fun way to test your understanding of Python execution.',
    href: '/lessons/python-foundations/output-match',
    icon: Target,
    isComingSoon: false, 
    ctaLabel: 'Try Challenge',
    dataAiHint: 'python quiz'
  },
  {
    title: 'Python: Syntax Spotter',
    description: 'Can you spot the syntax errors? Sharpen your Python debugging skills by identifying mistakes in code.',
    href: '/lessons/python-foundations/syntax-spotter',
    icon: SearchCode,
    isComingSoon: false, 
    ctaLabel: 'Spot Errors',
    dataAiHint: 'python debug'
  },
  {
    title: 'Python: Debug It!', 
    description: 'Fix broken Python code! Apply your knowledge to debug real-world-like scenarios and make the code run.',
    href: '/lessons/python-foundations/debug-it',
    icon: Wrench,
    isComingSoon: false, 
    ctaLabel: 'Debug Code',
    dataAiHint: 'python error'
  },
  {
    title: 'JS: Output Match',
    description: 'Match JavaScript code snippets to their correct console output. Test your JS execution knowledge.',
    href: '/lessons/javascript-essentials/output-match',
    icon: Target, 
    isComingSoon: false,
    ctaLabel: 'Try JS Challenge',
    dataAiHint: 'javascript quiz'
  },
  {
    title: 'JS: Syntax Spotter',
    description: 'Spot syntax errors in JavaScript code. A great way to improve your attention to detail.',
    href: '/lessons/javascript-essentials/syntax-spotter',
    icon: SearchCode,
    isComingSoon: false,
    ctaLabel: 'Spot JS Errors',
    dataAiHint: 'javascript debug'
  },
  {
    title: 'JS: Debug It!',
    description: 'Fix buggy JavaScript code! Use the in-browser sandbox to test and correct the snippets.',
    href: '/lessons/javascript-essentials/debug-it',
    icon: Wrench,
    isComingSoon: false,
    ctaLabel: 'Debug JS Code',
    dataAiHint: 'javascript error'
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
