
'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ALL_AI_STRATEGIES, type PlayerStrategy } from './GameTheoryEngine';

interface StrategySelectorProps {
  selectedStrategy: string; // Now refers to strategy ID
  onStrategyChange: (strategyId: string) => void;
  disabled?: boolean;
}

export default function StrategySelector({
  selectedStrategy,
  onStrategyChange,
  disabled = false,
}: StrategySelectorProps) {
  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Select Opponent's Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedStrategy}
          onValueChange={onStrategyChange}
          disabled={disabled}
          className="space-y-1"
          aria-label="Opponent strategy selection"
        >
          {ALL_AI_STRATEGIES.map((strategy) => (
            <div key={strategy.id} className="flex items-center space-x-2">
              <RadioGroupItem value={strategy.id} id={`strategy-${strategy.id}`} />
              <Label htmlFor={`strategy-${strategy.id}`} className="text-sm font-normal">
                {strategy.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
