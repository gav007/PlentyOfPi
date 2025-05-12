
'use client';

import type { ReactNode } from 'react';

interface ShapeModuleProps {
  children: ReactNode;
  title: string;
}

// This component might not be directly used if each ShapeTool (e.g., TriangleTool)
// acts as its own module wrapper. Or, it could be a higher-order component.
// For now, a simple wrapper.
export default function ShapeModule({ children, title }: ShapeModuleProps) {
  return (
    <div className="space-y-6">
      {/* Title might be handled by the page or specific tool component's CardHeader */}
      {/* <h2 className="text-2xl font-semibold text-center text-primary">{title}</h2> */}
      {children}
    </div>
  );
}
