
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  lines: string[];
  errorLineIndex?: number; // Highlight this line if submitted and incorrect, or always if showing solution
  selectedLineIndex: number | null;
  onLineSelect: (lineIndex: number) => void;
  disabled: boolean;
}

export default function CodeBlock({
  lines,
  errorLineIndex,
  selectedLineIndex,
  onLineSelect,
  disabled,
}: CodeBlockProps) {
  return (
    <div className="p-4 bg-gray-800 text-gray-200 font-mono rounded-md shadow-md overflow-x-auto">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Identify the line with a syntax error:</h3>
      {lines.map((line, index) => (
        <div
          key={index}
          onClick={() => !disabled && onLineSelect(index)}
          className={cn(
            "flex items-start py-1 px-2 rounded-sm group",
            !disabled && "cursor-pointer hover:bg-gray-700/70",
            disabled && "cursor-not-allowed",
            selectedLineIndex === index && !errorLineIndex && "bg-blue-500/30 ring-1 ring-blue-400",
            errorLineIndex !== undefined && errorLineIndex === index && "bg-red-500/40 ring-1 ring-red-400", // Highlight actual error line if revealed
            errorLineIndex !== undefined && selectedLineIndex === index && selectedLineIndex !== errorLineIndex && "bg-yellow-500/30 ring-1 ring-yellow-400" // Highlight user's wrong selection
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-pressed={selectedLineIndex === index}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onLineSelect(index);
            }
          }}
        >
          <span className="mr-3 select-none text-gray-500 w-6 text-right">{index + 1}</span>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed flex-1 group-hover:text-white transition-colors">{line || ' '}</pre> {/* Ensure empty lines are still clickable */}
        </div>
      ))}
    </div>
  );
}
