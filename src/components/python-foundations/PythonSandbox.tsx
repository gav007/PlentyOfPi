'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlayCircle, RotateCcw, AlertTriangle, Terminal, Loader2 } from 'lucide-react';

// Pyodide type, assuming it's loaded globally or via specific import if types were installed
declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<any>;
  }
}

const STARTER_CODE = `print("Hello, Plenty of π!")

# Try your Python code here
for i in range(5):
  print(f"Count: {i}")`;

export default function PythonSandbox() {
  const [code, setCode] = useState<string>(STARTER_CODE);
  const [output, setOutput] = useState<string>('');
  const [executionError, setExecutionError] = useState<string | null>(null); // For Python execution errors
  const [pyodideLoadingError, setPyodideLoadingError] = useState<string | null>(null); // For Pyodide loading errors
  const [isPyodideLoading, setIsPyodideLoading] = useState<boolean>(true);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const pyodideRef = useRef<any>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    let isMounted = true;
    const loadPyodideInstance = async () => {
      try {
        if (!document.getElementById('pyodide-script')) {
          const script = document.createElement('script');
          script.id = 'pyodide-script';
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
          script.async = true;
          document.head.appendChild(script);

          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN.'));
          });
        }
        
        // Wait for loadPyodide to be available
        let attempts = 0;
        while (!window.loadPyodide && attempts < 50) { // Max 5 seconds wait
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        if (!window.loadPyodide) {
          throw new Error("loadPyodide function not found on window object after script load.");
        }
        
        if (!isMounted) return;
        console.log("Loading Pyodide runtime...");
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
        });
        if (!isMounted) return;
        pyodideRef.current = pyodide;
        console.log("Pyodide runtime loaded successfully.");
        setOutput('Pyodide Loaded. Ready to execute Python code.');
        setPyodideLoadingError(null);
      } catch (err) {
        console.error('Failed to load Pyodide:', err);
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (isMounted) {
          setPyodideLoadingError(errorMsg);
          setOutput('');
        }
      } finally {
        if (isMounted) {
          setIsPyodideLoading(false);
        }
      }
    };

    loadPyodideInstance();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Auto-scroll output
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleRunCode = async () => {
    if (!pyodideRef.current) {
      setOutput('Pyodide is not ready. Please wait or check for loading errors.');
      return;
    }
    if (isExecuting) return;

    setIsExecuting(true);
    setExecutionError(null);
    setOutput('Executing code...\n');
    
    try {
      let capturedOutput = '';
      let capturedError = '';

      pyodideRef.current.setStdout({
        isPty: false, // to ensure batched is used or direct call for simple cases
        batched: (msg: string) => { capturedOutput += msg + '\\n'; }
      });
      pyodideRef.current.setStderr({
        isPty: false,
        batched: (msg: string) => { capturedError += msg + '\\n'; }
      });

      await pyodideRef.current.runPythonAsync(code);
      
      let finalOutput = '';
      if (capturedOutput) finalOutput += capturedOutput;
      if (capturedError) {
        finalOutput += (finalOutput ? '\\n--- Python Errors ---\\n' : '--- Python Errors ---\\n') + capturedError;
        setExecutionError('Execution finished with Python errors. See console for details.'); 
      }
      setOutput(finalOutput.trim() || 'Execution finished with no output.');

    } catch (err) {
      console.error('Error executing Python code with Pyodide:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setExecutionError(errorMsg); // Set specific execution error
      setOutput(`Runtime Error: ${errorMsg}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetCode = () => {
    setCode(STARTER_CODE);
    setOutput(pyodideRef.current ? 'Pyodide Loaded. Ready to execute Python code.' : pyodideLoadingError ? `Pyodide loading failed: ${pyodideLoadingError}` : 'Pyodide is loading...');
    setExecutionError(null);
    setPyodideLoadingError(null); // Clear loading error on reset attempt too, if user wants to retry
    if (!pyodideRef.current && !isPyodideLoading && pyodideLoadingError) {
      // Attempt to reload Pyodide if it failed and user clicks reset
      setIsPyodideLoading(true);
      // Re-trigger load (simplified for this example, more robust logic might be needed)
      const loadEffect = async () => {
        try {
          const pyodide = await window.loadPyodide({indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'});
          pyodideRef.current = pyodide;
          setOutput('Pyodide Loaded. Ready to execute Python code.');
          setPyodideLoadingError(null);
        } catch (e) {
          setPyodideLoadingError(e instanceof Error ? e.message : String(e));
        } finally {
          setIsPyodideLoading(false);
        }
      }
      loadEffect();
    }
  };
  

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="python-code-input" className="block text-sm font-medium text-foreground mb-1">
          Python Code Editor:
        </Label>
        <Textarea
          id="python-code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your Python code here..."
          className="min-h-[200px] font-mono text-sm bg-background border-input shadow-sm focus-visible:ring-primary"
          spellCheck="false"
          aria-label="Python code editor"
          rows={10}
        />
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button onClick={handleRunCode} disabled={isPyodideLoading || isExecuting} className="min-w-[140px]">
          {isPyodideLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...</>
          ) : isExecuting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Executing...</>
          ) : (
            <><PlayCircle className="mr-2 h-5 w-5" /> Run Code</>
          )}
        </Button>
        <Button onClick={handleResetCode} variant="outline" disabled={isExecuting}>
          <RotateCcw className="mr-2 h-5 w-5" /> Reset Code
        </Button>
      </div>
      
      <div>
         <Label htmlFor="python-output-console" className="block text-sm font-medium text-foreground mb-1 flex items-center">
          <Terminal className="mr-2 h-5 w-5 text-muted-foreground" /> Output Console:
        </Label>
        {(pyodideLoadingError || executionError) && (
          <div className="mb-2 p-3 text-sm text-destructive-foreground bg-destructive rounded-md flex items-start shadow">
            <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
            <pre className="whitespace-pre-wrap break-all font-mono text-xs">
              {pyodideLoadingError ? `Pyodide Loading Error: ${pyodideLoadingError}` : `Execution Error: ${executionError}`}
            </pre>
          </div>
        )}
        <Textarea
          ref={outputRef}
          id="python-output-console"
          value={output}
          readOnly
          placeholder={isPyodideLoading ? "Pyodide is loading, please wait..." : "Output will appear here..."}
          className="min-h-[150px] font-mono text-xs bg-gray-900 text-green-300 border-gray-700 rounded-md shadow-inner whitespace-pre-wrap break-words"
          aria-label="Python code output console"
          rows={8}
        />
      </div>
       <p className="text-xs text-muted-foreground mt-2">
          Python execution is powered by Pyodide, running directly in your browser.
        </p>
    </div>
  );
}
