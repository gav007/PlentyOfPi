
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Expression } from '@/types/graphing';
import { cn } from '@/lib/utils';

interface ExpressionInputPanelProps {
  expressions: Expression[];
  onExpressionChange: (id: string, value: string) => void;
  onAddExpression: () => void;
  onRemoveExpression: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  activeInputId: string | null;
  onSetActiveInputId: (id: string | null) => void;
}

export default function ExpressionInputPanel({
  expressions,
  onExpressionChange,
  onAddExpression,
  onRemoveExpression,
  onToggleVisibility,
  activeInputId,
  onSetActiveInputId,
}: ExpressionInputPanelProps) {
  
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    const activeIndex = expressions.findIndex(expr => expr.id === activeInputId);
    if (activeIndex !== -1 && inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex]?.focus();
      // Move cursor to end
      const len = inputRefs.current[activeIndex]?.value.length || 0;
      inputRefs.current[activeIndex]?.setSelectionRange(len, len);

    }
  }, [activeInputId, expressions]);


  return (
    <Card className="p-4 space-y-3 bg-muted/30 shadow">
      <Label className="text-base font-semibold text-foreground">Enter Expressions (e.g., y = x^2)</Label>
      {expressions.map((expr, index) => (
        <div key={expr.id} className="flex items-center gap-2">
          <div
            className="w-3 h-full rounded-l-md flex-shrink-0"
            style={{ backgroundColor: expr.color }}
            title={`Graph color: ${expr.color}`}
          ></div>
          <Input
            ref={el => inputRefs.current[index] = el}
            type="text"
            value={expr.value}
            onChange={(e) => onExpressionChange(expr.id, e.target.value)}
            onFocus={() => onSetActiveInputId(expr.id)}
            placeholder={`f${index + 1}(x) = ...`}
            className={cn(
              "flex-grow text-sm sm:text-base focus-visible:ring-offset-0",
              expr.error ? "border-destructive focus-visible:ring-destructive" : "border-input",
              activeInputId === expr.id && "ring-2 ring-primary ring-offset-background"
            )}
            aria-label={`Expression ${index + 1}`}
            aria-invalid={!!expr.error}
            aria-describedby={expr.error ? `expr-error-${expr.id}` : undefined}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleVisibility(expr.id)}
            title={expr.isVisible ? "Hide graph" : "Show graph"}
            className="h-8 w-8"
          >
            {expr.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveExpression(expr.id)}
            disabled={expressions.length <= 1}
            title="Remove expression"
            className="text-destructive hover:text-destructive h-8 w-8 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {expr.error && (
            <p id={`expr-error-${expr.id}`}className="text-xs text-destructive mt-1 col-span-full text-center">
              {expr.error}
            </p>
          )}
        </div>
      ))}
      <Button onClick={onAddExpression} variant="outline" className="w-full mt-2 text-sm">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Expression
      </Button>
    </Card>
  );
}
// Dummy Card component to satisfy the linter/compiler if not imported from ui
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("border bg-card text-card-foreground shadow-sm rounded-lg", className)}>
    {children}
  </div>
);
