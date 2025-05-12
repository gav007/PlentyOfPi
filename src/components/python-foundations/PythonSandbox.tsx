
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

const DEFAULT_STARTER_CODE = `print("Hello, Plenty of π!")

# Try your Python code here
for i in range(5):
  print(f"Count: {i}")`;

interface PythonSandboxProps {
  initialCode?: string;
}

export default function PythonSandbox({ initialCode = DEFAULT_STARTER_CODE }: PythonSandboxProps) {
  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<string>('');
  const [executionError, setExecutionError] = useState<string | null>(null); // For Python execution errors
  const [pyodideLoadingError, setPyodideLoadingError] = useState<string | null>(null); // For Pyodide loading errors
  const [isPyodideLoading, setIsPyodideLoading] = useState<boolean>(true);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const pyodideRef = useRef<any>(null);
  const outputRef = useRef<HTMLPreElement>(null);


  useEffect(() => {
    let isMounted = true;
    const loadPyodideInstance = async () => {
      try {
        if (!document.getElementById('pyodide-script')) {
          const script = document.createElement('script');
          script.id = 'pyodide-script';
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
          script.async = true;
          document.head.appendChild(script);

          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN.'));
          });
        }
        
        let attempts = 0;
        while (!window.loadPyodide && attempts < 50) { 
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        if (!window.loadPyodide) {
          throw new Error("loadPyodide function not found on window object after script load.");
        }
        
        if (!isMounted) return;
        console.log("Loading Pyodide runtime...");
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
        });
        if (!isMounted) return;
        pyodideRef.current = pyodide;
        console.log("Pyodide runtime loaded successfully.");
        if (initialCode === DEFAULT_STARTER_CODE) { // Only set default output if default code is used
            setOutput('Pyodide Loaded. Ready to execute Python code.');
        } else {
            setOutput(''); // For specific starter code, start with blank output
        }
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
  }, [initialCode]); // Add initialCode to dependency array

  useEffect(() => {
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
        isPty: false, 
        batched: (msg: string) => { capturedOutput += msg; }
      });
      pyodideRef.current.setStderr({
        isPty: false,
        batched: (msg: string) => { capturedError += msg; } 
      });

      await pyodideRef.current.runPythonAsync(code);
      
      let finalOutput = '';
      if (capturedOutput) finalOutput += capturedOutput;
      if (capturedError) {
        if (finalOutput && !finalOutput.endsWith('\n')) finalOutput += '\n';
        finalOutput += '--- Python Errors ---\n' + capturedError;
        setExecutionError('Execution finished with Python errors. See console for details.'); 
      }
      
      const executionMessageOnly = output === 'Executing code...\n';
      if (finalOutput.trim() || (!executionMessageOnly && finalOutput === '')) {
        setOutput(finalOutput);
      } else if (executionMessageOnly && !finalOutput.trim()) {
         setOutput('Execution finished with no output.');
      }

    } catch (err) {
      console.error('Error executing Python code with Pyodide:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setExecutionError(errorMsg); 
      setOutput(`Runtime Error: ${errorMsg}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetCode = () => {
    setCode(initialCode); // Reset to the initialCode prop
    setExecutionError(null);
    if (pyodideLoadingError) {
        setOutput(''); 
    } else if (pyodideRef.current) {
        if (initialCode === DEFAULT_STARTER_CODE) {
            setOutput('Pyodide Loaded. Ready to execute Python code.');
        } else {
            setOutput(''); // For specific starter code, reset to blank output
        }
    } else {
        setOutput('Pyodide is loading...');
    }

    if (!pyodideRef.current && !isPyodideLoading && pyodideLoadingError) {
      setIsPyodideLoading(true);
      setPyodideLoadingError(null); 
      const loadEffect = async () => {
        try {
          if (window.loadPyodide) {
            const pyodide = await window.loadPyodide({indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/'});
            pyodideRef.current = pyodide;
             if (initialCode === DEFAULT_STARTER_CODE) {
                setOutput('Pyodide Loaded. Ready to execute Python code.');
            } else {
                setOutput('');
            }
          } else {
            throw new Error("loadPyodide function not available on window.");
          }
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          setPyodideLoadingError(errorMsg);
          setOutput(''); 
        } finally {
          setIsPyodideLoading(false);
        }
      }
      loadEffect();
    }
  };
  
  const displayPlaceholder = output || executionError || pyodideLoadingError ? '' : "Output will appear here...";


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
              {pyodideLoadingError ? `Pyodide Loading Error: ${pyodideLoadingError}` : ``}
              {executionError && !pyodideLoadingError ? `Execution Error: ${executionError}` : ''}
            </pre>
          </div>
        )}
        <pre
          ref={outputRef}
          id="python-output-console"
          className="min-h-[150px] font-mono text-xs bg-gray-900 text-green-300 border border-gray-700 rounded-md shadow-inner overflow-auto p-2 whitespace-pre-wrap break-words h-full"
          aria-label="Python code output console"
          role="log"
        >
          {output || (!pyodideLoadingError && !executionError && displayPlaceholder) ? output : displayPlaceholder}
        </pre>
      </div>
       <p className="text-xs text-muted-foreground mt-2">
          Python execution is powered by Pyodide, running directly in your browser.
        </p>
    </div>
  );
}

