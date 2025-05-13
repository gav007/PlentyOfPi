
'use client';

import type { FunctionDefinition } from '@/types/graphify';
import FunctionInputItem from './FunctionInputItem';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FunctionListProps {
  functions: FunctionDefinition[];
  onUpdateFunction: (id: string, updates: Partial<Omit<FunctionDefinition, 'id'>>) => void;
  onDeleteFunction: (id: string) => void;
  onAddFunction: () => void;
}

export default function FunctionList({
  functions,
  onUpdateFunction,
  onDeleteFunction,
  onAddFunction,
}: FunctionListProps) {
  return (
    <div className="space-y-2">
      <ScrollArea className="h-[calc(100%-2.5rem)] max-h-[250px] pr-3 border rounded-md bg-card">
        <div className="divide-y divide-border">
          {functions.map((func) => (
            <FunctionInputItem
              key={func.id}
              func={func}
              onUpdate={onUpdateFunction}
              onDelete={onDeleteFunction}
              isOnlyFunction={functions.length === 1}
            />
          ))}
        </div>
      </ScrollArea>
      <Button onClick={onAddFunction} variant="outline" className="w-full text-sm">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Function
      </Button>
    </div>
  );
}
