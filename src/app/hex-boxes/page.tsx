import HexBoxesGame from '@/components/hex-boxes/HexBoxesGame';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hex Boxes Game | Plenty of π',
  description: 'Learn hexadecimal conversion by converting decimal numbers (0-255) to two-digit hex values interactively.',
};

export default function HexBoxesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HexBoxesGame />
    </div>
  );
}
