'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlayCircle, RotateCcw, AlertTriangle, Terminal, Loader2 } from 'lucide-react';

const DEFAULT_STARTER_CODE = `console.log("Hello, Plenty of π!");

// Try your JavaScript code here
for (let i = 0; i < 5; i++) {
  console.log(\`Count: \${i}\`);
}`;

interface JSCodeSandboxProps {
  initialCode?: string;
  onRunComplete?: (stdout: string, stderr: string | null) => void;
}

export default function JSCodeSandbox({ initialCode = DEFAULT_STARTER_CODE, onRunComplete }: JSCodeSandboxProps) {
  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const outputRef = useRef<HTMLPreElement>(null);

  const iframeSrcDoc = `
    <html>
      <head>
        <style>body { margin: 0; font-family: monospace; color: #e2e8f0; background-color: #1a202c; }</style>
      </head>
      <body>
        <script type="text/javascript">
          const originalConsole = { ...window.console };
          window.console = {
            log: (...args) => {
              originalConsole.log(...args);
              window.parent.postMessage({ type: 'sandbox-log', payload: args.map(arg => String(arg)).join(' ') }, '*');
            },
            error: (...args) => {
              originalConsole.error(...args);
              window.parent.postMessage({ type: 'sandbox-error', payload: args.map(arg => String(arg)).join(' ') }, '*');
            },
            warn: (...args) => {
              originalConsole.warn(...args);
              window.parent.postMessage({ type: 'sandbox-warn', payload: args.map(arg => String(arg)).join(' ') }, '*');
            },
            info: (...args) => {
              originalConsole.info(...args);
              window.parent.postMessage({ type: 'sandbox-info', payload: args.map(arg => String(arg)).join(' ') }, '*');
            }
          };

          window.addEventListener('error', (event) => {
            window.parent.postMessage({ type: 'sandbox-runtime-error', payload: event.message }, '*');
            return true; // Prevent default browser error handling in iframe console
          });

          window.addEventListener('message', (event) => {
            if (event.source === window.parent && event.data.type === 'execute-code') {
              try {
                new Function(event.data.code)();
                window.parent.postMessage({ type: 'sandbox-execution-finished' }, '*');
              } catch (e) {
                if (e instanceof Error) {
                   window.parent.postMessage({ type: 'sandbox-runtime-error', payload: e.message }, '*');
                } else {
                   window.parent.postMessage({ type: 'sandbox-runtime-error', payload: String(e) }, '*');
                }
              }
            }
          });
          window.parent.postMessage({ type: 'sandbox-ready' }, '*');
        </script>
      </body>
    </html>
  `;
  
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.source !== iframeRef.current?.contentWindow) return;

    const { type, payload } = event.data;
    setIsExecuting(false); // Stop loader once any message comes back

    switch (type) {
      case 'sandbox-log':
      case 'sandbox-info':
        setOutput(prev => [...prev, payload]);
        setError(null);
        onRunComplete?.(payload, null);
        break;
      case 'sandbox-error':
      case 'sandbox-warn':
      case 'sandbox-runtime-error':
        setOutput(prev => [...prev, `Error: ${payload}`]);
        setError(payload);
        onRunComplete?.("", payload);
        break;
      case 'sandbox-execution-finished':
        // Handled by output messages
        break;
      case 'sandbox-ready':
        // console.log("JS Sandbox ready");
        break;
    }
  }, [onRunComplete]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);


  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleRunCode = () => {
    if (!iframeRef.current?.contentWindow || isExecuting) return;
    
    setIsExecuting(true);
    setOutput([]); // Clear previous output
    setError(null);
    
    // Give a slight delay for UI update before potentially blocking with iframe message
    setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
           iframeRef.current.contentWindow.postMessage({ type: 'execute-code', code }, '*');
        } else {
            setError("Sandbox not ready.");
            setIsExecuting(false);
        }
    }, 50);
  };

  const handleResetCode = () => {
    setCode(initialCode);
    setOutput([]);
    setError(null);
  };
  
  const displayPlaceholder = output.length === 0 && !error ? "Output will appear here..." : "";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="js-code-input" className="block text-sm font-medium text-foreground mb-1">
          JavaScript Code Editor:
        </Label>
        <Textarea
          id="js-code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your JavaScript code here..."
          className="min-h-[200px] font-mono text-sm bg-background border-input shadow-sm focus-visible:ring-primary leading-relaxed"
          spellCheck="false"
          aria-label="JavaScript code editor"
          rows={10}
        />
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button onClick={handleRunCode} disabled={isExecuting} className="min-w-[140px]">
          {isExecuting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Executing...</>
          ) : (
            <><PlayCircle className="mr-2 h-5 w-5" /> Run Code</>
          )}
        </Button>
        <Button onClick={handleResetCode} variant="outline" disabled={isExecuting}>
          <RotateCcw className="mr-2 h-5 w-5" /> Reset Code
        </Button>
      </div>
      
      <iframe ref={iframeRef} srcDoc={iframeSrcDoc} title="JavaScript Sandbox" style={{ display: 'none' }} sandbox="allow-scripts"></iframe>

      <div>
         <Label htmlFor="js-output-console" className="block text-sm font-medium text-foreground mb-1 flex items-center">
          <Terminal className="mr-2 h-5 w-5 text-muted-foreground" /> Output Console:
        </Label>
        {error && (
          <div className="mb-2 p-3 text-sm text-destructive-foreground bg-destructive rounded-md flex items-start shadow">
            <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
            <pre 
              className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed"
            >
              Error: {error}
            </pre>
          </div>
        )}
        <pre
          ref={outputRef}
          id="js-output-console"
          className="min-h-[150px] font-mono text-xs bg-gray-900 text-green-300 border border-gray-700 rounded-md shadow-inner overflow-auto p-3 whitespace-pre-wrap break-words h-full leading-relaxed"
          aria-label="JavaScript code output console"
          role="log"
        >
          {output.length > 0 ? output.join('\n') : displayPlaceholder}
        </pre>
      </div>
       <p className="text-xs text-muted-foreground mt-2">
          JavaScript execution is sandboxed. Output from `console.log()` and errors will appear above.
        </p>
    </div>
  );
}