
'use client';

import type { FunctionDefinition } from '@/types/graphify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface FunctionInputItemProps {
  func: FunctionDefinition;
  onUpdate: (id: string, updates: Partial<Omit<FunctionDefinition, 'id'>>) => void;
  onDelete: (id: string) => void;
  isOnlyFunction: boolean;
}

const PREDEFINED_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EC4899', 
  '#8B5CF6', '#EF4444', '#6366F1', '#F97316'
];

export default function FunctionInputItem({ func, onUpdate, onDelete, isOnlyFunction }: FunctionInputItemProps) {
  const handleExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(func.id, { expression: e.target.value });
  };

  const handleColorChange = (color: string) => {
    onUpdate(func.id, { color });
  };

  const toggleVisibility = () => {
    onUpdate(func.id, { isVisible: !func.isVisible });
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors relative group">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0"
            title="Change graph color"
            aria-label="Change graph color"
          >
            <div
              className="w-4 h-4 rounded-full border border-foreground/30"
              style={{ backgroundColor: func.color }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-4 gap-1">
            {PREDEFINED_COLORS.map((color) => (
              <Button
                key={color}
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleColorChange(color)}
                aria-label={`Select color ${color}`}
              >
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} />
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Input
        type="text"
        value={func.expression}
        onChange={handleExpressionChange}
        placeholder="e.g., x^2 or sin(x)"
        className={cn(
          "flex-grow text-sm h-9 focus-visible:ring-offset-0",
          func.error ? "border-destructive focus-visible:ring-destructive" : "border-input"
        )}
        aria-label={`Function expression for y = ${func.expression || 'empty'}`}
        aria-invalid={!!func.error}
        aria-describedby={func.error ? `func-error-${func.id}` : undefined}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleVisibility}
        title={func.isVisible ? "Hide graph" : "Show graph"}
        className="h-7 w-7 flex-shrink-0"
        aria-label={func.isVisible ? "Hide graph for this function" : "Show graph for this function"}
      >
        {func.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(func.id)}
        disabled={isOnlyFunction}
        title="Delete function"
        className="text-destructive hover:text-destructive h-7 w-7 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Delete this function"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      {func.error && (
        <p id={`func-error-${func.id}`} className="absolute bottom-0 left-10 text-xs text-destructive bg-background px-1 rounded-t-sm">
          {func.error}
        </p>
      )}
    </div>
  );
}
