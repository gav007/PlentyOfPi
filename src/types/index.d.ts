import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
};

export type FeatureCardItem = {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  imageSrc?: string;
  imageAlt?: string;
  dataAiHint?: string;
  ctaLabel?: string;
  isComingSoon?: boolean;
};
