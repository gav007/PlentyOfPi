
'use client';

import type { Fraction } from './FractionBlocksCard';
import { Button } from '@/components/ui/button';
import { XCircle, Plus } from 'lucide-react';

interface WorkspaceProps {
  blocks: Fraction[];
  onRemoveBlock: (id: string) => void;
}

export default function Workspace({ blocks, onRemoveBlock }: WorkspaceProps) {
  return (
    <div className="p-4 border rounded-lg bg-muted/30 min-h-[120px] flex items-center justify-center">
      <h3 className="text-lg font-semibold text-muted-foreground sr-only">Workspace</h3>
      {blocks.length === 0 ? (
        <p className="text-muted-foreground">Workspace is empty. Add fractions from the palette.</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {blocks.map((block, index) => (
            <div key={block.id} className="flex items-center gap-2">
              {index > 0 && <Plus className="w-5 h-5 text-muted-foreground" />}
              <div className="relative group bg-card p-1 rounded-md shadow-md border border-border">
                <div className="flex flex-col items-center justify-center w-16 h-20">
                  <span className="text-xl font-bold text-primary">{block.num}</span>
                  <hr className="w-10/12 border-t border-foreground my-0.5" />
                  <span className="text-xl font-bold text-primary">{block.den}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-card hover:bg-destructive text-destructive opacity-50 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveBlock(block.id)}
                  aria-label={`Remove fraction ${block.num}/${block.den}`}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
