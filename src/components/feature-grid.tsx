import FeatureCard from '@/components/feature-card';
import { featureCards } from '@/config/site';

export default function FeatureGrid() {
  const binaryGameCard = featureCards.find(card => card.title.includes("Binary Converter Game"));
  const otherCards = featureCards.filter(card => !card.title.includes("Binary Converter Game"));

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {binaryGameCard && (
          <div className="mb-12 md:mb-16 max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold tracking-tight text-center mb-4">Featured Game</h2>
            <FeatureCard item={binaryGameCard} />
          </div>
        )}
        
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore More Tools & Lessons</h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Discover a range of interactive resources to boost your knowledge.
          </p>
        </div>
        
        {otherCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCards.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
