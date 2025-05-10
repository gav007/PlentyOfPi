import BitToggleGame from '@/components/binary-game/BitToggleGame';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binary Converter Game | Plenty of π',
  description: 'Learn binary conversion with an interactive 8-bit and 16-bit game. Convert between binary, decimal, and hex.',
};

export default function BinaryGamePage() {
  return (
    <div className="py-8">
      <BitToggleGame />
    </div>
  );
}
