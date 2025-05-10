import UnitCircleExplorer from '@/components/unit-circle/UnitCircleExplorer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Unit Circle | Plenty of π',
  description: 'Explore the unit circle, angles, radians, degrees, sine, cosine, tangent, and the sine wave interactively.',
};

export default function UnitCirclePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <UnitCircleExplorer />
    </div>
  );
}
