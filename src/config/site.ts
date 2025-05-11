import type { NavItem, FeatureCardItem } from '@/types';
import { Brain, Calculator, BookOpen, Archive, Zap, Puzzle, HomeIcon, Orbit, SigmaSquare, Scale, Binary, Unplug, TreeDeciduous } from 'lucide-react'; // Added TreeDeciduous

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
  { title: "Home", href: "/", icon: HomeIcon },
  {
    title: "Practice",
    href: "#", // Non-clickable parent for dropdown
    icon: Brain, // Icon for the "Practice" category
    subItems: [
      { title: "Binary Game", href: "/binary-game", icon: Binary }, 
      { title: "Unit Circle", href: "/unit-circle", icon: Orbit },
      { title: "Hex Boxes", href: "/hex-boxes", icon: Puzzle },
      { title: "Calculus Playground", href: "/calculus-playground", icon: SigmaSquare },
    ]
  },
  {
    title: "Quick Math",
    href: "#",
    icon: Zap,
    subItems: [
      { title: "Prime Factorization", href: "/quick-math/prime-quarry", icon: TreeDeciduous }, 
      { title: "Fraction Blocks", href: "/quick-math/fraction-blocks", icon: Puzzle }, 
      { title: "Ratio Scales", href: "/quick-math/ratio-scales", icon: Scale },
    ]
  },
  { title: "Lessons", href: "/lessons", icon: BookOpen, disabled: false },
  { title: "Calculators", href: "/calculators", icon: Calculator, disabled: true },
  { title: "Flashcards", href: "/flashcards", icon: Archive, disabled: true },
];

export const featureCards: FeatureCardItem[] = [
  {
    title: "8-Bit & 16-Bit Binary Game",
    description: "Test your binary skills! Convert numbers to decimal and hex in this interactive game. Supports 8-bit and 16-bit modes.",
    href: "/binary-game",
    icon: Binary, 
    imageSrc: "https://picsum.photos/seed/binarygame/600/400",
    imageAlt: "Abstract representation of binary code",
    dataAiHint: "binary code",
    ctaLabel: "Play Now",
  },
  {
    title: "Interactive Unit Circle",
    description: "Explore the relationship between angles, trigonometric functions (sin, cos, tan), and the sine wave in real-time.",
    href: "/unit-circle",
    icon: Orbit,
    imageSrc: "https://picsum.photos/seed/unitcircle/600/400",
    imageAlt: "Unit circle diagram with sine wave",
    dataAiHint: "math trigonometry",
    ctaLabel: "Explore Now",
  },
  {
    title: "Hex Boxes Game",
    description: "Convert decimal numbers (0-255) to two-digit hexadecimal values using interactive digit selection.",
    href: "/hex-boxes",
    icon: Puzzle,
    imageSrc: "https://picsum.photos/seed/hexboxes/600/400",
    imageAlt: "Grid of hexadecimal digits",
    dataAiHint: "hexadecimal conversion",
    ctaLabel: "Play Game",
  },
   {
    title: "Calculus Playground",
    description: "Visualize functions, derivatives, and integrals. Input a function and see its graph, tangent, and area under the curve interactively.",
    href: "/calculus-playground",
    icon: SigmaSquare, 
    imageSrc: "https://picsum.photos/seed/calculus/600/400",
    imageAlt: "Graph of a function with its derivative and integral highlighted",
    dataAiHint: "calculus graph",
    ctaLabel: "Explore Calculus",
  },
  {
    title: "Prime Factorization Tree",
    description: "Enter a number and see its prime factors visualized as a tree. Understand how numbers break down into primes.",
    href: "/quick-math/prime-quarry",
    icon: TreeDeciduous, 
    imageSrc: "https://picsum.photos/seed/primefactorization/600/400",
    imageAlt: "A tree structure showing prime factors",
    dataAiHint: "prime numbers tree",
    ctaLabel: "Factorize Now",
  },
  {
    title: "Fraction Blocks",
    description: "Combine and simplify fractions visually. Understand common denominators and fraction arithmetic step-by-step.",
    href: "/quick-math/fraction-blocks",
    icon: Puzzle, 
    imageSrc: "https://picsum.photos/seed/fractionblocks/600/400",
    imageAlt: "Visual blocks representing fractions being combined",
    dataAiHint: "fractions math",
    ctaLabel: "Learn Fractions",
  },
  {
    title: "Ratio Scales",
    description: "Balance weights on scales to understand ratios and proportions. An interactive way to learn about equivalent ratios.",
    href: "/quick-math/ratio-scales",
    icon: Scale,
    imageSrc: "https://picsum.photos/seed/ratioscales/600/400",
    imageAlt: "A balance scale with weights on both sides",
    dataAiHint: "ratio balance",
    ctaLabel: "Explore Ratios",
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
    href: "/calculators",
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
    href: "/flashcards",
    icon: Archive,
    imageSrc: "https://picsum.photos/seed/flashcards/600/400",
    imageAlt: "Stack of digital flashcards",
    dataAiHint: "study memory",
    ctaLabel: "Study Flashcards",
    isComingSoon: true,
  },
];
