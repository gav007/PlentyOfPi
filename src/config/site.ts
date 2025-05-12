
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
  FileCode, 
  Target, 
  SearchCode, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  FileJson,
  LineChart,
  FunctionSquare,
  Shapes, // For Geometry Tools category
  Triangle,
  Circle,
  Square,
  LayoutPanelLeft, // For Trapezium
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
        title: 'Geometry Tools',
        href: '/geometry', // Main landing for geometry tools (optional)
        icon: Shapes,
        description: 'Interactive geometry calculators.',
        // Sub-items for individual geometry tools will be listed here if a separate /geometry page is made
        // Or directly link to the first tool, e.g. /geometry/triangle if no main geometry page
      },
    ],
  },
  {
    title: 'Geometry', // New top-level category for direct access
    href: '#', // This will be a dropdown trigger
    icon: Shapes,
    subItems: [
      {
        title: 'Triangle Calculator',
        href: '/geometry/triangle',
        icon: Triangle,
        description: 'Calculate properties of triangles.',
      },
      {
        title: 'Circle Calculator',
        href: '/geometry/circle',
        icon: Circle,
        description: 'Calculate properties of circles.',
      },
      {
        title: 'Square Calculator',
        href: '/geometry/square',
        icon: Square,
        description: 'Calculate properties of squares.',
      },
      {
        title: 'Trapezium Calculator',
        href: '/geometry/trapezium',
        icon: LayoutPanelLeft, // Using LayoutPanelLeft for Trapezium
        description: 'Calculate properties of trapeziums.',
      },
    ],
  },
  {
    title: 'Graphing Calculator',
    href: '/graphing-calculator',
    icon: Calculator,
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
      }
    ]
  },
];

export const featureCards: FeatureCardItem[] = [
  {
    title: 'Binary Converter Game',
    description: 'Master binary numbers with our interactive 8-bit and 16-bit converter game. Toggle bits, see instant decimal and hex conversions, and test your skills in game mode!',
    href: '/binary-game',
    icon: Brain,
    imageSrc: 'https://picsum.photos/seed/binarygame/600/400',
    imageAlt: 'Binary game interface with toggles and lights',
    dataAiHint: 'binary code',
    ctaLabel: 'Play Now',
  },
  {
    title: 'Python Foundations',
    description: 'Embark on your Python journey! Learn the fundamentals with interactive lessons, a code sandbox, and gamified challenges.',
    href: '/lessons/python-foundations',
    icon: FileCode,
    imageSrc: 'https://picsum.photos/seed/pythoncourse/600/400',
    imageAlt: 'Python code on a screen',
    dataAiHint: 'python programming',
    ctaLabel: 'Start Learning',
  },
  {
    title: 'Interactive Unit Circle',
    description: 'Explore the unit circle dynamically. Drag the angle, see radians, degrees, and trigonometric values (sin, cos, tan) update in real-time. Visualize the linked sine wave.',
    href: '/unit-circle',
    icon: Orbit,
    imageSrc: 'https://picsum.photos/seed/unitcircletool/600/400',
    imageAlt: 'Unit circle diagram with sine wave',
    dataAiHint: 'math diagram',
    ctaLabel: 'Explore Circle',
  },
  {
    title: 'Calculus Playground',
    description: 'Visualize calculus concepts. Input functions, explore graphs, derivatives (as tangent lines), and integrals (area under curve) with an interactive slider and customizable graph bounds.',
    href: '/calculus-playground',
    icon: Sigma,
    imageSrc: 'https://picsum.photos/seed/calculustool/600/400',
    imageAlt: 'Graph of a function with tangent line and shaded area',
    dataAiHint: 'calculus graph',
    ctaLabel: 'Start Plotting',
  },
  {
    title: 'Triangle Calculator',
    description: 'Interactively calculate area, perimeter, angles, and more for triangles. Drag vertices or input values.',
    href: '/geometry/triangle',
    icon: Triangle,
    imageSrc: 'https://picsum.photos/seed/triangletool/600/400',
    imageAlt: 'Interactive triangle diagram',
    dataAiHint: 'triangle geometry',
    ctaLabel: 'Explore Triangles',
    isComingSoon: false, // Assuming it will be built now
  },
  {
    title: 'Circle Calculator',
    description: 'Explore circles. Calculate area, circumference, and diameter with interactive inputs and visuals.',
    href: '/geometry/circle',
    icon: Circle,
    imageSrc: 'https://picsum.photos/seed/circletool/600/400',
    imageAlt: 'Interactive circle diagram',
    dataAiHint: 'circle geometry',
    ctaLabel: 'Explore Circles',
    isComingSoon: false, // Assuming it will be built now
  },
  {
    title: 'Square Calculator',
    description: 'Calculate area, perimeter, and diagonal of squares. Interactive resizing and visual feedback.',
    href: '/geometry/square',
    icon: Square,
    imageSrc: 'https://picsum.photos/seed/squaretool/600/400',
    imageAlt: 'Interactive square diagram',
    dataAiHint: 'square geometry',
    ctaLabel: 'Explore Squares',
    isComingSoon: false, // Assuming it will be built now
  },
  {
    title: 'Trapezium Calculator',
    description: 'Work with trapeziums. Calculate area and other properties with dynamic inputs for bases and height.',
    href: '/geometry/trapezium',
    icon: LayoutPanelLeft,
    imageSrc: 'https://picsum.photos/seed/trapeziumtool/600/400',
    imageAlt: 'Interactive trapezium diagram',
    dataAiHint: 'trapezium geometry',
    ctaLabel: 'Explore Trapeziums',
    isComingSoon: false, // Assuming it will be built now
  },
  {
    title: 'Graphing Calculator',
    description: 'Plot functions, explore equations, and visualize math concepts with our powerful graphing calculator. (Coming Soon!)',
    href: '/graphing-calculator',
    icon: LineChart, 
    imageSrc: 'https://picsum.photos/seed/graphingcalcfeature/600/400',
    imageAlt: 'Advanced graphing calculator interface',
    dataAiHint: 'graph calculator',
    isComingSoon: true,
    ctaLabel: 'Explore (Soon)',
  },
  {
    title: 'Hex Boxes Challenge',
    description: 'Learn hexadecimal conversion by converting decimal numbers (0-255) to two-digit hex values. Select digits from a grid and test your understanding in challenge or learn mode.',
    href: '/hex-boxes',
    icon: Puzzle,
    imageSrc: 'https://picsum.photos/seed/hexgame/600/400',
    imageAlt: 'Hexadecimal digit selection grid',
    dataAiHint: 'hexadecimal code',
    ctaLabel: 'Play Hex Game',
  },
  {
    title: 'Fraction Duel',
    description: 'Challenge your fraction arithmetic! Solve expressions by choosing the correct simplified answer from multiple choices. Difficulty increases with each turn.',
    href: '/quick-math/fraction-duel',
    icon: TestTubeDiagonal,
    imageSrc: 'https://picsum.photos/seed/fractiongame/600/400',
    imageAlt: 'Fraction expression with multiple choice answers',
    dataAiHint: 'fraction math game',
    ctaLabel: 'Start Duel',
  },
  {
    title: 'Ratio Scales',
    description: 'Balance weights on virtual scales to intuitively understand ratios and proportions. Experiment with different weights and see how equivalent ratios are formed.',
    href: '/quick-math/ratio-scales',
    icon: Scale,
    imageSrc: 'https://picsum.photos/seed/ratiogame/600/400',
    imageAlt: 'Balance scale with weights',
    dataAiHint: 'balance scale math',
    ctaLabel: 'Explore Ratios',
  },
  {
    title: 'Python: Output Match',
    description: 'Match Python code snippets to their correct output. A fun way to test your understanding of Python execution.',
    href: '/lessons/python-foundations/output-match',
    icon: Target,
    imageSrc: 'https://picsum.photos/seed/pyoutputchallenge/600/400',
    imageAlt: 'Python code and output comparison',
    dataAiHint: 'python coding',
    isComingSoon: false, 
    ctaLabel: 'Try Challenge',
  },
  {
    title: 'Python: Syntax Spotter',
    description: 'Can you spot the syntax errors? Sharpen your Python debugging skills by identifying mistakes in code.',
    href: '/lessons/python-foundations/syntax-spotter',
    icon: SearchCode,
    imageSrc: 'https://picsum.photos/seed/pysyntaxchallenge/600/400',
    imageAlt: 'Python code with highlighted errors',
    dataAiHint: 'python syntax',
    isComingSoon: false, 
    ctaLabel: 'Spot Errors',
  },
  {
    title: 'Python: Debug It!', 
    description: 'Fix broken Python code! Apply your knowledge to debug real-world-like scenarios and make the code run.',
    href: '/lessons/python-foundations/debug-it',
    icon: Wrench,
    imageSrc: 'https://picsum.photos/seed/pydebugchallenge/600/400',
    imageAlt: 'Python code with debugging tools',
    dataAiHint: 'python debugging code',
    isComingSoon: false, 
    ctaLabel: 'Debug Code',
  },
  {
    title: 'Data Structures Visualizer',
    description: 'Coming soon! Interactive visualizations of common data structures like arrays, linked lists, trees, and graphs. Understand their operations and complexities.',
    href: '#', // Update when page is ready
    icon: FileJson,
    imageSrc: 'https://picsum.photos/seed/datastructuresvis/600/400',
    imageAlt: 'Abstract representation of data structures',
    dataAiHint: 'data structures',
    isComingSoon: true,
    ctaLabel: 'Coming Soon',
  },
  {
    title: 'Algorithm Arena',
    description: 'Coming soon! Step through popular algorithms like sorting, searching, and pathfinding. See how they work with animated examples and explanations.',
    href: '#', // Update when page is ready
    icon: BarChart3,
    imageSrc: 'https://picsum.photos/seed/algorithmsvis/600/400',
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
