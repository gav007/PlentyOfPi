
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shapes, Triangle, Circle, Square, LayoutPanelLeft, ArrowRight } from 'lucide-react';
import { featureCards } from '@/config/site'; // Use existing feature cards

export const metadata: Metadata = {
  title: 'Geometry Tools | Plenty of π',
  description: 'Explore interactive geometry calculators for various shapes like triangles, circles, squares, and trapeziums.',
};

export default function GeometryToolsPage() {
  const geometryFeatureCards = featureCards.filter(card => 
    card.href.startsWith('/geometry/')
  );

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <Shapes className="w-16 h-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Interactive Geometry Tools
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore shapes, calculate properties, and visualize geometry concepts with our hands-on tools.
        </p>
      </header>

      {geometryFeatureCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {geometryFeatureCards.map((item) => (
            <Card key={item.title} className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03]">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {item.icon && <item.icon className="w-8 h-8 text-primary" />}
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={item.href}>
                    {item.ctaLabel || 'Explore Tool'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
         <div className="text-center">
            <p className="text-xl text-muted-foreground">Geometry tools are being crafted. Check back soon!</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
