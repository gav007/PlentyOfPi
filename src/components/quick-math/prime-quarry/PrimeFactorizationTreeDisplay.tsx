'use client';

import *_React from 'react'; // _React to avoid conflict if React is not directly used in this file's logic but needed for JSX
import { cn } from '@/lib/utils';

export interface TreeNode {
  value: number;
  isPrime: boolean;
  children?: [TreeNode, TreeNode];
}

interface TreeNodeComponentProps {
  node: TreeNode;
  isRoot?: boolean;
  isLastChild?: boolean; // To help with connector styling if needed
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({ node, isRoot = false }) => {
  const nodeStyle = cn(
    "px-3 py-1.5 rounded-md shadow-md border text-center inline-block",
    node.isPrime ? "bg-green-100 border-green-400 text-green-700 font-semibold" : "bg-blue-100 border-blue-400 text-blue-700",
    "min-w-[40px]"
  );

  return (
    <div className={cn("flex flex-col items-center relative pt-4", !isRoot && "px-2 sm:px-4")}>
      {/* Node itself */}
      <div className={nodeStyle}>
        {node.value}
      </div>

      {/* Children and connecting lines */}
      {node.children && node.children.length > 0 && (
        <>
          {/* Vertical line from parent to horizontal connector */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-4 w-0.5 bg-gray-400"></div>
          
          <div className="flex justify-center mt-4 w-full">
            {node.children.map((child, index) => (
              <div key={index} className={cn(
                  "flex-1 flex flex-col items-center relative",
                  node.children && node.children.length > 1 && index === 0 && "pr-1 sm:pr-2", // spacing between children
                  node.children && node.children.length > 1 && index === 1 && "pl-1 sm:pl-2"
                )}>
                {/* Horizontal line connector part - from center to child's vertical line */}
                <div className={cn(
                    "absolute top-[-10px] h-0.5 bg-gray-400",
                    node.children && node.children.length === 1 ? "hidden" : "", // No horizontal line for single child
                    node.children && node.children.length > 1 && index === 0 ? "left-1/2 w-1/2" : "",
                    node.children && node.children.length > 1 && index === 1 ? "right-1/2 w-1/2" : ""
                  )}>
                </div>
                <TreeNodeComponent node={child} isRoot={false} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


interface PrimeFactorizationTreeDisplayProps {
  rootNode: TreeNode | null;
}

export default function PrimeFactorizationTreeDisplay({ rootNode }: PrimeFactorizationTreeDisplayProps) {
  if (!rootNode) {
    return null; // Or a placeholder message if numberToFactor was null initially
  }

  return (
    <div className="p-4 overflow-x-auto w-full flex justify-center">
       <TreeNodeComponent node={rootNode} isRoot={true}/>
    </div>
  );
}
