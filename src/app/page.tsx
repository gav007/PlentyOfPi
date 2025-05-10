import HeroSection from '@/components/hero-section';
import FeatureGrid from '@/components/feature-grid';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="py-8 border-t bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Plenty of π. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Designed to make learning awesome.
        </p>
      </div>
    </footer>
  );
}
