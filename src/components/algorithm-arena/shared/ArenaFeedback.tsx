
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Info }_from_lucide-react'; // Ensure Info is imported
import { cn } from '@/lib/utils';

interface ArenaFeedbackProps {
  type: 'success' | 'error' | 'info' | null;
  title?: string;
  message: string | React.ReactNode;
  className?: string;
}

export default function ArenaFeedback({ type, title, message, className }: ArenaFeedbackProps) {
  if (!type || !message) {
    return null;
  }

  let IconComponent;
  let variant: 'default' | 'destructive';
  let defaultTitle = '';

  switch (type) {
    case 'success':
      IconComponent = CheckCircle;
      variant = 'default';
      defaultTitle = 'Success!';
      break;
    case 'error':
      IconComponent = XCircle;
      variant = 'destructive';
      defaultTitle = 'Error!';
      break;
    case 'info':
    default:
      IconComponent = Info;
      variant = 'default';
      defaultTitle = 'Information';
      break;
  }

  const effectiveTitle = title || defaultTitle;

  return (
    <Alert 
      variant={variant} 
      className={cn(
        type === 'success' && 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400',
        type === 'info' && !className?.includes('bg-') && 'bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-400', // Default info style if no custom bg
        className
      )}
    >
      <div className="flex items-center gap-2">
        <IconComponent className="h-5 w-5" />
        {effectiveTitle && <AlertTitle className="font-semibold">{effectiveTitle}</AlertTitle>}
      </div>
      <AlertDescription className={effectiveTitle ? "pl-7" : ""}>
        {message}
      </AlertDescription>
    </Alert>
  );
}
