
'use client';

import type * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface FunctionInputProps {
  functionStr: string;
  onFunctionStrChange: (newStr: string) => void;
}

export default function FunctionInput({ functionStr, onFunctionStrChange }: FunctionInputProps) {
  const [inputValue, setInputValue] = React.useState(functionStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFunctionStrChange(inputValue);
  };

  React.useEffect(() => {
    setInputValue(functionStr);
  }, [functionStr]);

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor="function-input" className="text-base font-semibold">Enter function f(x):</Label>
      <div className="flex items-center gap-2">
        <Input
          id="function-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g., x^2, sin(x), sqrt(x)"
          className="text-base"
        />
        <Button type="submit" size="icon" aria-label="Plot function">
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Supported: x, numbers, +, -, *, /, ^, sqrt(), sin(), cos(), tan(), ln(), log10(), exp(), abs(). Example: <code>2*x^3 + sin(x/2)</code>
      </p>
    </form>
  );
}
