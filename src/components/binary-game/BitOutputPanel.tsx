import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BitOutputPanelProps {
  decimal: number;
  hex: string;
  binary: string;
}

export default function BitOutputPanel({ decimal, hex, binary }: BitOutputPanelProps) {
  return (
    <Card 
      className="mb-6 shadow-lg w-full max-w-md mx-auto" 
      role="status" 
      aria-live="polite"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl sm:text-2xl text-primary">Converted Values</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <p className="text-sm sm:text-base">
          <span className="font-semibold text-muted-foreground">DEC:</span>{' '}
          <span className="font-mono text-lg sm:text-xl text-foreground" aria-label={`Decimal value: ${decimal}`}>{decimal}</span>
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-semibold text-muted-foreground">HEX:</span>{' '}
          <span className="font-mono text-lg sm:text-xl text-foreground" aria-label={`Hexadecimal value: ${hex}`}>{hex}</span>
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-semibold text-muted-foreground">BIN:</span>{' '}
          <span className="font-mono text-lg sm:text-xl text-foreground break-all" aria-label={`Binary value: ${binary}`}>{binary}</span>
        </p>
      </CardContent>
    </Card>
  );
}
