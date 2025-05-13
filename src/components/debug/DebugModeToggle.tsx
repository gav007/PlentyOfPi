// src/components/debug/DebugModeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface DebugModeToggleProps {
  onToggle: (isDebugMode: boolean) => void;
  initialDebugMode?: boolean;
}

export default function DebugModeToggle({ onToggle, initialDebugMode = false }: DebugModeToggleProps) {
  const [isDebugMode, setIsDebugMode] = useState(initialDebugMode);

  useEffect(() => {
    // Allow toggling debug mode via query parameter for easier testing
    // e.g., ?debug=true or ?debug=false
    const params = new URLSearchParams(window.location.search);
    const debugQuery = params.get('debug');
    if (debugQuery !== null) {
      const queryValue = debugQuery === 'true';
      setIsDebugMode(queryValue);
      onToggle(queryValue);
    }
  }, [onToggle]);

  const handleToggle = (checked: boolean) => {
    setIsDebugMode(checked);
    onToggle(checked);
    // Optionally persist to localStorage or update URL query param
    const params = new URLSearchParams(window.location.search);
    if (checked) {
      params.set('debug', 'true');
    } else {
      params.delete('debug');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  // Only render this component in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-3 bg-card border border-border shadow-lg rounded-lg flex items-center space-x-2">
      {isDebugMode ? <Eye className="h-5 w-5 text-primary" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
      <Label htmlFor="debug-mode-switch" className="text-sm font-medium text-foreground">
        Debug Mode
      </Label>
      <Switch
        id="debug-mode-switch"
        checked={isDebugMode}
        onCheckedChange={handleToggle}
        aria-label="Toggle debug mode"
      />
    </div>
  );
}
