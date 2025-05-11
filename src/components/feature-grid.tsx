
import FeatureCard from '@/components/feature-card';
import { featureCards } from '@/config/site';

export default function FeatureGrid() {
  // Manually define the order or featured items if needed
  const binaryGameCard = featureCards.find(card => card.title.includes("Binary Converter Game"));
  const pythonFoundationsCard = featureCards.find(card => card.title.includes("Python Foundations"));
  
  // Filter out the main featured cards to avoid duplication if they are explicitly placed
  const otherCards = featureCards.filter(card => 
    !card.title.includes("Binary Converter Game") && 
    !card.title.includes("Python Foundations")
  );

  // Sort other cards perhaps, or leave as is from config
  // Example: Put "Coming Soon" cards at the end
  const sortedOtherCards = [...otherCards].sort((a, b) => {
    if (a.isComingSoon && !b.isComingSoon) return 1;
    if (!a.isComingSoon && b.isComingSoon) return -1;
    return 0;
  });


  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        {(binaryGameCard || pythonFoundationsCard) && (
           <h2 className="text-3xl font-bold tracking-tight text-center mb-10 md:mb-12 sm:text-4xl">Featured Tools & Lessons</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 md:mb-16 max-w-4xl mx-auto">
            {pythonFoundationsCard && (
                <FeatureCard item={pythonFoundationsCard} />
            )}
            {binaryGameCard && (
                <FeatureCard item={binaryGameCard} />
            )}
        </div>
        
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore More</h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Discover a range of interactive resources to boost your knowledge in math and computer science.
          </p>
        </div>
        
        {sortedOtherCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedOtherCards.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
