
'use client';

import type { FunctionDefinition } from '@/types/graphify'; // Updated to use shared Graphify type
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, EyeOff, Palette, PlusCircle, AlertTriangle } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const PREDEFINED_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EC4899',
  '#8B5CF6', '#EF4444', '#6366F1', '#F97316',
  '#22D3EE', '#A3E635', '#FFC107', '#4CAF50'
];


interface ExpressionInputPanelProps {
  expressions: FunctionDefinition[];
  onExpressionChange: (id: string, value: string) => void;
  onAddExpression: () => void;
  onDeleteExpression: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  activeInputId: string | null;
  setActiveInputId: (id: string | null) => void;
  maxExpressions: number;
}

export default function ExpressionInputPanel({
  expressions,
  onExpressionChange,
  onAddExpression,
  onDeleteExpression,
  onToggleVisibility,
  onColorChange,
  activeInputId,
  setActiveInputId,
  maxExpressions,
}: ExpressionInputPanelProps) {
  return (
    <TooltipProvider delayDuration={300}>
    <div className="p-3 sm:p-4 space-y-2 border rounded-lg bg-card shadow-sm h-full flex flex-col">
      <div className="flex-grow space-y-1.5 overflow-y-auto max-h-[calc(100%-2.5rem)] pr-1">
        {expressions.map((expr, index) => (
          <div key={expr.id} className="flex items-center gap-1.5 group relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0 rounded-full focus-visible:ring-offset-0 focus-visible:ring-1"
                  title={`Change graph color for y = ${expr.expression || `f${index + 1}(x)`}`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-foreground/30"
                    style={{ backgroundColor: expr.color }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 bg-popover shadow-lg rounded-md">
                <div className="grid grid-cols-4 gap-1">
                  {PREDEFINED_COLORS.map((color) => (
                    <Button
                      key={color}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-sm hover:bg-accent"
                      onClick={() => onColorChange(expr.id, color)}
                    >
                      <div className="w-4 h-4 rounded-sm border border-border" style={{ backgroundColor: color }} />
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <span className="text-xs font-mono text-muted-foreground w-10 text-right pr-1 select-none">
              y<sub>{index+1}</sub> =
            </span>
            <Input
              type="text"
              value={expr.expression}
              onChange={(e) => onExpressionChange(expr.id, e.target.value)}
              onFocus={() => setActiveInputId(expr.id)}
              placeholder={`e.g., x^2`}
              className={cn(
                "flex-grow text-sm h-8 focus-visible:ring-offset-0 focus-visible:ring-1",
                expr.error ? "border-destructive focus-visible:ring-destructive text-destructive pr-7" : "border-input",
                activeInputId === expr.id && "ring-2 ring-primary border-primary"
              )}
              aria-label={`Expression ${index + 1}. Current value: ${expr.expression}. ${expr.error ? 'Error: ' + expr.error : ''}`}
              aria-invalid={!!expr.error}
              aria-describedby={expr.error ? `expr-error-${expr.id}` : undefined}
            />
             {expr.error && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-11 sm:right-12 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-destructive text-destructive-foreground text-xs max-w-xs p-1.5">
                  <p id={`expr-error-${expr.id}`}>{expr.error}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleVisibility(expr.id)}
              title={expr.isVisible ? "Hide graph" : "Show graph"}
              className="h-7 w-7 flex-shrink-0 focus-visible:ring-offset-0 focus-visible:ring-1"
              aria-pressed={expr.isVisible}
            >
              {expr.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteExpression(expr.id)}
              disabled={expressions.length === 1}
              title="Delete expression"
              className="text-destructive hover:text-destructive h-7 w-7 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:ring-offset-0 focus-visible:ring-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        onClick={onAddExpression}
        variant="outline"
        className="w-full text-sm mt-auto h-9"
        disabled={expressions.length >= maxExpressions}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Expression
      </Button>
    </div>
    </TooltipProvider>
  );
}
