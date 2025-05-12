
'use client';

import * as React from 'react';
import type { Expression } from '@/types/graphing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
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
        <div key={expr.id} className="flex flex-col gap-1 p-2 border rounded-md bg-muted/20 shadow-sm focus-within:ring-2 focus-within:ring-ring">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0"
              style={{ backgroundColor: expr.color, color: expr.visible ? 'white' : 'rgba(255,255,255,0.7)' }} // Adjust color for visibility icon
              onClick={() => onToggleVisibility(expr.id)}
              aria-label={expr.visible ? "Hide expression from graph" : "Show expression on graph"}
              title={expr.visible ? "Hide expression" : "Show expression"}
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
                activeInputId === expr.id && !expr.error && "ring-2 ring-primary border-primary" // Only show primary ring if not in error state
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
              title="Remove expression"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {expr.error && (
            <div id={`expr-error-${expr.id}`} className="flex items-center text-xs text-destructive pl-1 py-0.5" role="alert">
              <AlertTriangle className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{expr.error}</span>
            </div>
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
