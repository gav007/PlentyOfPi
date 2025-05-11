
import RatioScalesCard from '@/components/quick-math/ratio-scales/RatioScalesCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ratio Scales | Quick Math | Plenty of π',
  description: 'Balance weights on scales to understand ratios and proportions. An interactive way to learn about equivalent ratios.',
};

export default function RatioScalesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <RatioScalesCard />
    </div>
  );
}
