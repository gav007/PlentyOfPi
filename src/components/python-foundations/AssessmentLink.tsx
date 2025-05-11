
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, ExternalLink } from 'lucide-react';

export default function AssessmentLink() {
  return (
    <div className="text-center space-y-3">
      <p className="text-muted-foreground">
        Ready to test your knowledge? Take the final assessment to gauge your understanding of Python fundamentals.
        This quiz mimics the PCEP certification format.
      </p>
      <Button asChild size="lg" disabled>
        <Link href="/lessons/python-foundations/assessment">
          <ClipboardCheck className="mr-2 h-5 w-5" /> Start Final Assessment (Coming Soon)
        </Link>
      </Button>
    </div>
  );
}
