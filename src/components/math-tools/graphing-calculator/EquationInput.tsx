
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import type { Expression } from '@/types/graphing';
import { cn } from '@/lib/utils';

interface EquationInputProps {
  expression: Expression;
  onValueChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onFocus: () => void;
  isOnlyExpression: boolean;
  isActive: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  index: number;
}

export default function EquationInput({
  expression,
  onValueChange,
  onRemove,
  onToggleVisibility,
  onFocus,
  isOnlyExpression,
  isActive,
  inputRef,
  index
}: EquationInputProps) {
  return (
    <div className="flex items-center gap-2 p-1 rounded-md hover:bg-muted/50 transition-colors">
      <div
        className="w-2 h-6 rounded-sm flex-shrink-0 cursor-pointer"
        style={{ backgroundColor: expression.color }}
        title={`Graph color: ${expression.color}. Click to toggle visibility.`}
        onClick={() => onToggleVisibility(expression.id)}
        role="button"
        aria-pressed={expression.isVisible}
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleVisibility(expression.id)}
      >
        {!expression.isVisible && <EyeOff className="w-2 h-full text-background/50 opacity-50" />}
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={expression.value}
        onChange={(e) => onValueChange(expression.id, e.target.value)}
        onFocus={onFocus}
        placeholder={`f${index + 1}(x) = ...`}
        className={cn(
          "flex-grow text-sm sm:text-base h-9 focus-visible:ring-offset-0",
          expression.error ? "border-destructive focus-visible:ring-destructive" : "border-input",
          isActive && !expression.error && "ring-1 ring-primary border-primary"
        )}
        aria-label={`Expression ${index + 1}. Current value: ${expression.value || 'empty'}. Color: ${expression.color}`}
        aria-invalid={!!expression.error}
        aria-describedby={expression.error ? `expr-error-${expression.id}` : undefined}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToggleVisibility(expression.id)}
        title={expression.isVisible ? "Hide graph" : "Show graph"}
        className="h-7 w-7 flex-shrink-0"
        aria-label={expression.isVisible ? "Hide graph for this expression" : "Show graph for this expression"}
      >
        {expression.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(expression.id)}
        disabled={isOnlyExpression}
        title="Remove expression"
        className="text-destructive hover:text-destructive h-7 w-7 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Remove this expression"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      {expression.error && (
        <p id={`expr-error-${expression.id}`} className="sr-only">
          Error: {expression.error}
        </p>
      )}
    </div>
  );
}
