import type { ReactNode } from 'react';
import JSSidebarTOC from '@/components/javascript-essentials/JSSidebarTOC'; // Specific JS Sidebar
import jsFoundationsModules from '@/config/jsFoundationsContent';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export async function generateStaticParams() {
  return jsFoundationsModules.map((module) => ({
    moduleSlug: module.slug,
  }));
}

export default function JavaScriptModuleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { moduleSlug: string };
}) {
  const module = jsFoundationsModules.find(m => m.slug === params.moduleSlug);

  if (!module) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Module Not Found</h1>
        <p className="text-muted-foreground">The JavaScript module you're looking for doesn't exist.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/lessons/javascript-essentials">Back to JavaScript Essentials</Link>
        </Button>
      </div>
    );
  }
  
  const moduleIndex = jsFoundationsModules.findIndex(m => m.slug === params.moduleSlug);
  // Using different color scheme for JS modules - e.g., yellows/oranges
  const moduleColorClasses = [
    "border-yellow-500", "bg-yellow-500/10", "text-yellow-700", // Module 1
    "border-orange-500", "bg-orange-500/10", "text-orange-700", // Module 2
    "border-amber-500", "bg-amber-500/10", "text-amber-700", // Module 3
    "border-lime-500", "bg-lime-500/10", "text-lime-700", // Module 4
    "border-emerald-500", "bg-emerald-500/10", "text-emerald-700", // Module 5
  ];
  const colorIndex = moduleIndex % moduleColorClasses.length;
  const borderColor = moduleColorClasses[colorIndex * 3];
  const bgColor = moduleColorClasses[colorIndex * 3 + 1];
  const textColor = moduleColorClasses[colorIndex * 3 + 2];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5 md:sticky md:top-20 md:max-h-[calc(100vh-5rem)] overflow-y-auto">
        <div className={`p-4 rounded-lg shadow-md ${bgColor} border ${borderColor}`}>
          <Button asChild variant="ghost" size="sm" className={`mb-3 ${textColor} hover:bg-opacity-20`}>
            <Link href="/lessons/javascript-essentials">
              <ChevronLeft className="w-4 h-4 mr-1" /> All JS Modules
            </Link>
          </Button>
          <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>{module.title}</h2>
          <JSSidebarTOC module={module} currentModuleSlug={params.moduleSlug} />
        </div>
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5">
        {children}
      </main>
    </div>
  );
}