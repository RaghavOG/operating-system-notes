import { ReactNode } from 'react';

/**
 * Template component for consistent page structure
 * This helps with transitions and loading states
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="animate-in fade-in-50 duration-300">
      {children}
    </div>
  );
}

