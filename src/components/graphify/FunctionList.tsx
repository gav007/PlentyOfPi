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
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow max-h-[200px] sm:max-h-[280px] pr-1 border rounded-md bg-card"> {/* Increased max-h slightly */}
        <div className="divide-y divide-border"> {/* Moved divide-y here for item separation */}
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
      <Button onClick={onAddFunction} variant="outline" className="w-full text-sm mt-2 h-9">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Function
      </Button>
    </div>
  );
}
