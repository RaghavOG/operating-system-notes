'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ className, size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center min-h-screen', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-t-2 border-b-2 border-blue-600 dark:border-blue-400',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
          {text}
        </p>
      )}
    </div>
  );
}
