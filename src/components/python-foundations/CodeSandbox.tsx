
'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlayCircle, RotateCcw } from 'lucide-react';

export default function CodeSandbox() {
  const [code, setCode] = useState('print("Hello, Plenty of π!")\n\n# Try your Python code here\nfor i in range(5):\n  print(f"Count: {i}")');
  const [output, setOutput] = useState<string | null>(null);

  const handleRunCode = () => {
    // Placeholder for actual code execution (e.g., via Pyodide or backend API)
    setOutput(`Simulated output for:\n${code}\n\n(Actual execution environment not implemented in this prototype)`);
  };

  const handleResetCode = () => {
    setCode('print("Hello, Plenty of π!")\n\n# Try your Python code here\nfor i in range(5):\n  print(f"Count: {i}")');
    setOutput(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="python-code-input" className="block text-sm font-medium text-foreground mb-1">
          Python Code:
        </label>
        <Textarea
          id="python-code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your Python code here..."
          className="min-h-[200px] font-mono text-sm bg-background"
          spellCheck="false"
        />
      </div>
      <div className="flex space-x-3">
        <Button onClick={handleRunCode}>
          <PlayCircle className="mr-2 h-5 w-5" /> Run Code
        </Button>
        <Button onClick={handleResetCode} variant="outline">
          <RotateCcw className="mr-2 h-5 w-5" /> Reset
        </Button>
      </div>
      {output !== null && (
        <div>
          <label htmlFor="python-code-output" className="block text-sm font-medium text-foreground mb-1">
            Output:
          </label>
          <Textarea
            id="python-code-output"
            value={output}
            readOnly
            className="min-h-[100px] font-mono text-sm bg-muted/50"
          />
        </div>
      )}
    </div>
  );
}
