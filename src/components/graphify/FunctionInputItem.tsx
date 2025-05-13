
'use client';

import type { FunctionDefinition } from '@/types/graphify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, Palette, AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface FunctionInputItemProps {
  func: FunctionDefinition;
  onUpdate: (id: string, updates: Partial<Omit<FunctionDefinition, 'id'>>) => void;
  onDelete: (id: string) => void;
  isOnlyFunction: boolean;
}

const PREDEFINED_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EC4899',
  '#8B5CF6', '#EF4444', '#6366F1', '#F97316',
  '#22D3EE', '#A3E635', '#FFC107', '#4CAF50'
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
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1.5 p-1.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors relative group">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0 rounded-full focus-visible:ring-offset-0 focus-visible:ring-1"
              title="Change graph color"
              aria-label="Change graph color"
            >
              <div
                className="w-4 h-4 rounded-full border border-foreground/30"
                style={{ backgroundColor: func.color }}
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
                  onClick={() => handleColorChange(color)}
                  aria-label={`Select color ${color}`}
                >
                  <div className="w-4 h-4 rounded-sm border border-border" style={{ backgroundColor: color }} />
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
            "flex-grow text-sm h-8 focus-visible:ring-offset-0 focus-visible:ring-1",
            func.error ? "border-destructive focus-visible:ring-destructive text-destructive pr-7" : "border-input"
          )}
          aria-label={`Function expression for y = ${func.expression || 'empty'}. ${func.error ? 'Error: ' + func.error : ''}`}
          aria-invalid={!!func.error}
          aria-describedby={func.error ? `func-error-${func.id}` : undefined}
        />
        {func.error && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute right-16 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center">
                 <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-destructive text-destructive-foreground text-xs max-w-xs p-2">
              <p id={`func-error-${func.id}`}>{func.error}</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleVisibility}
          title={func.isVisible ? "Hide graph" : "Show graph"}
          className="h-7 w-7 flex-shrink-0 focus-visible:ring-offset-0 focus-visible:ring-1"
          aria-label={func.isVisible ? "Hide graph for this function" : "Show graph for this function"}
          aria-pressed={func.isVisible}
        >
          {func.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(func.id)}
          disabled={isOnlyFunction}
          title="Delete function"
          className="text-destructive hover:text-destructive h-7 w-7 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:ring-offset-0 focus-visible:ring-1"
          aria-label="Delete this function"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </TooltipProvider>
  );
}
