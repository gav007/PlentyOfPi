import type { NavItem, FeatureCardItem } from '@/types';
import { Brain, Calculator, BookOpen, Archive, Zap, Puzzle } from 'lucide-react';

export const siteConfig = {
  name: "Plenty of π",
  description: "Learn and explore with Plenty of π - interactive math and CS tools.",
  url: "https://example.com", // Replace with your actual URL
  ogImage: "https://example.com/og.jpg", // Replace with your actual OG image
  links: {
    github: "https://github.com/your-repo", // Replace with your GitHub repo
  },
};

export const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Binary Game", href: "/binary-game" },
  { title: "Lessons", href: "/lessons", icon: BookOpen },
  { title: "Calculators", href: "/calculators", icon: Calculator },
  { title: "Flashcards", href: "/flashcards", icon: Archive },
];

export const featureCards: FeatureCardItem[] = [
  {
    title: "8-Bit Binary Converter Game",
    description: "Test your binary conversion skills! Convert 8-bit numbers to decimal and vice-versa in this interactive game. Sharpen your understanding of base-2 systems.",
    href: "/binary-game",
    icon: Brain,
    imageSrc: "https://picsum.photos/seed/binarygame/600/400",
    imageAlt: "Abstract representation of binary code",
    dataAiHint: "binary code",
    ctaLabel: "Play Now",
  },
  {
    title: "Interactive Lessons",
    description: "Dive into curated lessons on computer science fundamentals, mathematical concepts, and more. Learn at your own pace with engaging content.",
    href: "/lessons",
    icon: BookOpen,
    imageSrc: "https://picsum.photos/seed/lessons/600/400",
    imageAlt: "Open book with glowing pages",
    dataAiHint: "education learning",
    ctaLabel: "Explore Lessons",
    isComingSoon: false,
  },
  {
    title: "Math Calculators",
    description: "A suite of useful calculators for various mathematical problems. From algebra to calculus, find the tools you need. (Coming Soon)",
    href: "#",
    icon: Calculator,
    imageSrc: "https://picsum.photos/seed/calculators/600/400",
    imageAlt: "Stylized calculator interface",
    dataAiHint: "math tools",
    ctaLabel: "Use Calculators",
    isComingSoon: true,
  },
  {
    title: "Digital Flashcards",
    description: "Memorize key concepts with our digital flashcard system. Create your own decks or use pre-made ones. (Coming Soon)",
    href: "#",
    icon: Archive,
    imageSrc: "https://picsum.photos/seed/flashcards/600/400",
    imageAlt: "Stack of digital flashcards",
    dataAiHint: "study memory",
    ctaLabel: "Study Flashcards",
    isComingSoon: true,
  },
  {
    title: "Logic Puzzles",
    description: "Challenge your mind with a variety of logic puzzles designed to improve critical thinking and problem-solving skills. (Coming Soon)",
    href: "#",
    icon: Puzzle,
    imageSrc: "https://picsum.photos/seed/puzzles/600/400",
    imageAlt: "Abstract puzzle pieces",
    dataAiHint: "brain teaser",
    ctaLabel: "Solve Puzzles",
    isComingSoon: true,
  },
  {
    title: "Quick Algorithms",
    description: "Explore and understand common algorithms with interactive visualizations and explanations. (Coming Soon)",
    href: "#",
    icon: Zap,
    imageSrc: "https://picsum.photos/seed/algorithms/600/400",
    imageAlt: "Flowchart of an algorithm",
    dataAiHint: "computer science",
    ctaLabel: "Learn Algorithms",
    isComingSoon: true,
  },
];
