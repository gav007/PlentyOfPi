
import type { NavItem, FeatureCardItem } from '@/types';
import {
  Home,
  Gamepad2,
  Brain,
  Orbit,
  Puzzle,
  Sigma,
  Calculator,
  DivideSquare,
  Scale,
  BookOpen,
  Lightbulb,
  BarChart3,
  FileJson,
  Github,
  Settings
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
    ],
  },
  {
    title: 'Tools',
    href: '#',
    icon: Settings, // Using Settings as a generic "Tools" icon
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
    href: '#',
    icon: Calculator,
    subItems: [
      {
        title: 'Fraction Blocks',
        href: '/quick-math/fraction-blocks',
        icon: DivideSquare,
        description: 'Combine and simplify fractions visually.',
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
    href: '/lessons',
    icon: BookOpen,
    disabled: true, // Assuming lessons page is not yet ready
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
    title: 'Fraction Blocks',
    description: 'Understand fraction arithmetic visually. Add fraction blocks to a workspace, find common denominators, and compute their sum with step-by-step insights.',
    href: '/quick-math/fraction-blocks',
    icon: DivideSquare,
    imageSrc: 'https://picsum.photos/seed/fractions/600/400',
    imageAlt: 'Visual representation of fraction blocks',
    dataAiHint: 'math blocks',
    ctaLabel: 'Learn Fractions',
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

// Example of a more complex NavItem structure for the Header component
export const siteConfig = {
  name: "Plenty of π",
  description: "Interactive tools and engaging lessons to make learning math and computer science fun and accessible.",
  url: "https://example.com", // Replace with your actual domain
  ogImage: "https://example.com/og.jpg", // Replace
  links: {
    twitter: "https://twitter.com/example", // Replace
    github: "https://github.com/example/plenty-of-pi", // Replace
  },
  navItems, // from above
  featureCards, // from above
};

export type SiteConfig = typeof siteConfig;
