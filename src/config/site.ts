
import type { NavItem, FeatureCardItem } from '@/types';
import {
  Home,
  Gamepad2,
  Brain,
  Orbit,
  Puzzle,
  Sigma,
  Calculator,
  TestTubeDiagonal, 
  Scale,
  BookOpen,
  Settings,
  FileCode, // For Python Foundations module
  Target, // For Output Match
  SearchCode, // For Syntax Spotter
  Wrench, // For Debug It
  ClipboardCheck, // For Assessment
  BarChart3, // Keep for existing coming soon card
  FileJson, // Keep for existing coming soon card
} from 'lucide-react';

export const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Games',
    href: '#', // Main item not a link if it has subItems
    icon: Gamepad2,
    subItems: [
      {
        title: 'Binary Converter',
        href: '/binary-game',
        icon: Brain,
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
    ],
  },
  {
    title: 'Tools',
    href: '#', // Main item not a link if it has subItems
    icon: Settings, 
    subItems: [
       {
        title: 'Calculus Playground',
        href: '/calculus-playground',
        icon: Sigma,
        description: 'Visualize functions, derivatives, and integrals.',
      },
    ],
  },
  {
    title: 'Quick Math',
    href: '#', // Main item not a link if it has subItems
    icon: Calculator,
    subItems: [
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
    title: 'Lessons',
    href: '/lessons', // Link to a lessons overview page
    icon: BookOpen,
    disabled: false, // Enable lessons
    subItems: [
      {
        title: 'Python Foundations',
        href: '/lessons/python-foundations',
        icon: FileCode,
        description: 'Learn core Python concepts step by step.',
      }
      // Add other lesson modules here, e.g. Statistics when ready
    ]
  },
];

export const featureCards: FeatureCardItem[] = [
  {
    title: 'Binary Converter Game',
    description: 'Master binary numbers with our interactive 8-bit and 16-bit converter game. Toggle bits, see instant decimal and hex conversions, and test your skills in game mode!',
    href: '/binary-game',
    icon: Brain,
    imageSrc: 'https://picsum.photos/seed/binary/600/400',
    imageAlt: 'Binary game interface with toggles and lights',
    dataAiHint: 'binary code',
    ctaLabel: 'Play Now',
  },
  {
    title: 'Python Foundations',
    description: 'Embark on your Python journey! Learn the fundamentals with interactive lessons, a code sandbox, and gamified challenges.',
    href: '/lessons/python-foundations',
    icon: FileCode,
    imageSrc: 'https://picsum.photos/seed/pythondev/600/400',
    imageAlt: 'Python code on a screen',
    dataAiHint: 'python programming',
    ctaLabel: 'Start Learning',
  },
  {
    title: 'Interactive Unit Circle',
    description: 'Explore the unit circle dynamically. Drag the angle, see radians, degrees, and trigonometric values (sin, cos, tan) update in real-time. Visualize the linked sine wave.',
    href: '/unit-circle',
    icon: Orbit,
    imageSrc: 'https://picsum.photos/seed/unitcircle/600/400',
    imageAlt: 'Unit circle diagram with sine wave',
    dataAiHint: 'math diagram',
    ctaLabel: 'Explore Circle',
  },
  {
    title: 'Calculus Playground',
    description: 'Visualize calculus concepts. Input functions, explore graphs, derivatives (as tangent lines), and integrals (area under curve) with an interactive slider and customizable graph bounds.',
    href: '/calculus-playground',
    icon: Sigma,
    imageSrc: 'https://picsum.photos/seed/calculus/600/400',
    imageAlt: 'Graph of a function with tangent line and shaded area',
    dataAiHint: 'calculus graph',
    ctaLabel: 'Start Plotting',
  },
  {
    title: 'Hex Boxes Challenge',
    description: 'Learn hexadecimal conversion by converting decimal numbers (0-255) to two-digit hex values. Select digits from a grid and test your understanding in challenge or learn mode.',
    href: '/hex-boxes',
    icon: Puzzle,
    imageSrc: 'https://picsum.photos/seed/hexbox/600/400',
    imageAlt: 'Hexadecimal digit selection grid',
    dataAiHint: 'hexadecimal code',
    ctaLabel: 'Play Hex Game',
  },
  {
    title: 'Fraction Duel',
    description: 'Challenge your fraction arithmetic! Solve expressions by choosing the correct simplified answer from multiple choices. Difficulty increases with each turn.',
    href: '/quick-math/fraction-duel',
    icon: TestTubeDiagonal,
    imageSrc: 'https://picsum.photos/seed/fractionduel/600/400',
    imageAlt: 'Fraction expression with multiple choice answers',
    dataAiHint: 'fraction math quiz',
    ctaLabel: 'Start Duel',
  },
  {
    title: 'Ratio Scales',
    description: 'Balance weights on virtual scales to intuitively understand ratios and proportions. Experiment with different weights and see how equivalent ratios are formed.',
    href: '/quick-math/ratio-scales',
    icon: Scale,
    imageSrc: 'https://picsum.photos/seed/ratios/600/400',
    imageAlt: 'Balance scale with weights',
    dataAiHint: 'balance scale',
    ctaLabel: 'Explore Ratios',
  },
  // Python Foundations Gamified Cards - mark as active
  {
    title: 'Python: Output Match',
    description: 'Match Python code snippets to their correct output. A fun way to test your understanding of Python execution.',
    href: '/lessons/python-foundations/output-match',
    icon: Target,
    imageSrc: 'https://picsum.photos/seed/pyoutput/600/400',
    imageAlt: 'Python code and output comparison',
    dataAiHint: 'python code',
    isComingSoon: false, // Activated
    ctaLabel: 'Try Challenge',
  },
  {
    title: 'Python: Syntax Spotter',
    description: 'Can you spot the syntax errors? Sharpen your Python debugging skills by identifying mistakes in code.',
    href: '/lessons/python-foundations/syntax-spotter',
    icon: SearchCode,
    imageSrc: 'https://picsum.photos/seed/pysyntax/600/400',
    imageAlt: 'Python code with highlighted errors',
    dataAiHint: 'python syntax error',
    isComingSoon: false, // Activated
    ctaLabel: 'Spot Errors',
  },
  {
    title: 'Python: Debug It!', // Updated title slightly for consistency
    description: 'Fix broken Python code! Apply your knowledge to debug real-world-like scenarios and make the code run.',
    href: '/lessons/python-foundations/debug-it',
    icon: Wrench,
    imageSrc: 'https://picsum.photos/seed/pydebug/600/400',
    imageAlt: 'Python code with debugging tools',
    dataAiHint: 'python debugging',
    isComingSoon: false, // Activated
    ctaLabel: 'Debug Code',
  },
  {
    title: 'Data Structures Visualizer',
    description: 'Coming soon! Interactive visualizations of common data structures like arrays, linked lists, trees, and graphs. Understand their operations and complexities.',
    href: '#',
    icon: FileJson,
    imageSrc: 'https://picsum.photos/seed/datastructures/600/400',
    imageAlt: 'Abstract representation of data structures',
    dataAiHint: 'data structure',
    isComingSoon: true,
    ctaLabel: 'Coming Soon',
  },
  {
    title: 'Algorithm Arena',
    description: 'Coming soon! Step through popular algorithms like sorting, searching, and pathfinding. See how they work with animated examples and explanations.',
    href: '#',
    icon: BarChart3,
    imageSrc: 'https://picsum.photos/seed/algorithms/600/400',
    imageAlt: 'Flowchart representing an algorithm',
    dataAiHint: 'algorithm flowchart',
    isComingSoon: true,
    ctaLabel: 'Coming Soon',
  },
];

export const siteConfig = {
  name: "Plenty of π",
  description: "Interactive tools and engaging lessons to make learning math and computer science fun and accessible.",
  url: "https://example.com", 
  ogImage: "https://example.com/og.jpg", 
  links: {
    twitter: "https://twitter.com/example", 
    github: "https://github.com/example/plenty-of-pi", 
  },
  navItems, 
  featureCards, 
};

export type SiteConfig = typeof siteConfig;
