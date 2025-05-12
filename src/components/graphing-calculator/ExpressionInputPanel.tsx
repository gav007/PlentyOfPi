
'use client';

import * as React from 'react';
import type { Expression } from '@/types/graphing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpressionInputPanelProps {
  expressions: Expression[];
  onExpressionChange: (id: string, value: string) => void;
  onRemoveExpression: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  activeInputId: string | null;
  setActiveInputId: (id: string | null) => void;
}

export default function ExpressionInputPanel({
  expressions,
  onExpressionChange,
  onRemoveExpression,
  onToggleVisibility,
  activeInputId,
  setActiveInputId,
}: ExpressionInputPanelProps) {
  return (
    <div className="space-y-3">
      {expressions.map((expr, index) => (
        <div key={expr.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/20 shadow-sm focus-within:ring-2 focus-within:ring-ring">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0"
            style={{ backgroundColor: expr.color, color: 'white' }} // Use a contrasting color for icon if needed
            onClick={() => onToggleVisibility(expr.id)}
            aria-label={expr.visible ? "Hide expression from graph" : "Show expression on graph"}
          >
            {expr.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Input
            type="text"
            value={expr.value}
            onChange={e => onExpressionChange(expr.id, e.target.value)}
            onFocus={() => setActiveInputId(expr.id)}
            placeholder={`f${index + 1}(x) = ... e.g., x^2 + sin(x)`}
            className={cn(
              "flex-grow text-sm h-9 focus:border-transparent focus:ring-0",
              expr.error && "border-destructive ring-destructive focus-visible:ring-destructive",
              activeInputId === expr.id && "ring-2 ring-primary border-primary"
            )}
            aria-label={`Expression ${index + 1} input. Current value: ${expr.value}`}
            aria-invalid={!!expr.error}
            aria-describedby={expr.error ? `expr-error-${expr.id}` : undefined}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveExpression(expr.id)}
            className="h-7 w-7 flex-shrink-0 text-destructive hover:bg-destructive/10"
            aria-label={`Remove expression ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {expr.error && (
            <p id={`expr-error-${expr.id}`} className="text-xs text-destructive col-span-full text-right pr-2 py-1">
              {expr.error}
            </p>
          )}
        </div>
      ))}
       {expressions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Click the '+' button above to add your first expression.
        </p>
      )}
    </div>
  );
}
