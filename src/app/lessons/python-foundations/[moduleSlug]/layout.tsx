
import type { ReactNode } from 'react';
import SidebarTOC from '@/components/python-foundations/SidebarTOC';
import pythonFoundationsModules from '@/config/pythonFoundationsContent';
import type { LessonModule } from '@/types/lessons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export async function generateStaticParams() {
  return pythonFoundationsModules.map((module) => ({
    moduleSlug: module.slug,
  }));
}

export default function PythonModuleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { moduleSlug: string };
}) {
  const module = pythonFoundationsModules.find(m => m.slug === params.moduleSlug);

  if (!module) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Module Not Found</h1>
        <p className="text-muted-foreground">The Python module you're looking for doesn't exist.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/lessons/python-foundations">Back to Python Foundations</Link>
        </Button>
      </div>
    );
  }
  
  const moduleIndex = pythonFoundationsModules.findIndex(m => m.slug === params.moduleSlug);
  const moduleColorClasses = [
    "border-blue-500", "bg-blue-500/10", "text-blue-700", // Module 1
    "border-green-500", "bg-green-500/10", "text-green-700", // Module 2
    "border-yellow-500", "bg-yellow-500/10", "text-yellow-700", // Module 3
    "border-purple-500", "bg-purple-500/10", "text-purple-700", // Module 4
    "border-pink-500", "bg-pink-500/10", "text-pink-700", // Module 5
  ];
  const colorIndex = moduleIndex % moduleColorClasses.length; // Cycle through colors
  const borderColor = moduleColorClasses[colorIndex * 3];
  const bgColor = moduleColorClasses[colorIndex * 3 + 1];
  const textColor = moduleColorClasses[colorIndex * 3 + 2];


  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5 md:sticky md:top-20 md:max-h-[calc(100vh-5rem)] overflow-y-auto">
        <div className={`p-4 rounded-lg shadow-md ${bgColor} border ${borderColor}`}>
          <Button asChild variant="ghost" size="sm" className={`mb-3 ${textColor} hover:bg-opacity-20`}>
            <Link href="/lessons/python-foundations">
              <ChevronLeft className="w-4 h-4 mr-1" /> All Modules
            </Link>
          </Button>
          <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>{module.title}</h2>
          <SidebarTOC module={module} currentModuleSlug={params.moduleSlug} />
        </div>
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5">
        {children}
      </main>
    </div>
  );
}
