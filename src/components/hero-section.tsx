import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Unlock the World of Numbers & Code
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Plenty of π offers interactive tools and engaging lessons to make learning math and computer science fun and accessible for everyone.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/binary-game">
                  Play Binary Game
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/lessons">
                  Explore Lessons
                </Link>
              </Button>
            </div>
          </div>
          <Image
            src="https://picsum.photos/seed/hero/1200/800"
            width="1200"
            height="800"
            alt="Abstract representation of interconnected data points"
            data-ai-hint="abstract tech"
            className="mx-auto aspect-video overflow-hidden rounded-2xl object-cover sm:w-full lg:order-last shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
