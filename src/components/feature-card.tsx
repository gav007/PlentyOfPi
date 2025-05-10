import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FeatureCardItem } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  item: FeatureCardItem;
}

export default function FeatureCard({ item }: FeatureCardProps) {
  const { title, description, href, icon: Icon, imageSrc, imageAlt, dataAiHint, ctaLabel = "Learn More", isComingSoon } = item;

  return (
    <Card className="flex flex-col h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03] overflow-hidden">
      {imageSrc && (
        <div className="relative w-full h-48">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            data-ai-hint={dataAiHint}
            fill
            className="object-cover"
          />
          {isComingSoon && (
            <Badge variant="secondary" className="absolute top-3 right-3 shadow">Coming Soon</Badge>
          )}
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-8 h-8 text-primary" />}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className={cn("w-full", isComingSoon && "opacity-70 cursor-not-allowed")} disabled={isComingSoon}>
          <Link href={isComingSoon ? "#" : href}>
            {ctaLabel}
            {!isComingSoon && <ArrowRight className="ml-2 h-4 w-4" />}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
