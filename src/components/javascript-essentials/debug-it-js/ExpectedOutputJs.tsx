
interface ExpectedOutputJsProps {
  output: string;
}

export default function ExpectedOutputJs({ output }: ExpectedOutputJsProps) {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Expected Console Output:</h3>
      <pre className="whitespace-pre-wrap text-sm font-mono text-foreground leading-relaxed">{output}</pre>
    </div>
  );
}
