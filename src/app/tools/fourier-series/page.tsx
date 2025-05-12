
import FourierVisualizer from '@/components/math-tools/fourier-series/FourierVisualizer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fourier Series Visualizer | Plenty of π',
  description: 'Explore Fourier series and see how complex waveforms are built from simple sine waves and epicycles.',
};

export default function FourierSeriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FourierVisualizer />
    </div>
  );
}
