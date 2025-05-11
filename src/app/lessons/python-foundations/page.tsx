
import type { Metadata } from 'next';
import PythonFoundationsLayout from '@/components/python-foundations/PythonFoundationsLayout';

export const metadata: Metadata = {
  title: 'Python Foundations | Plenty of π',
  description: 'Learn core Python concepts, from syntax to data structures, and prepare for PCEP certification.',
};

export default function PythonFoundationsPage() {
  return <PythonFoundationsLayout />;
}
