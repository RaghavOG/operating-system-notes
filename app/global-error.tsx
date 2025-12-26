'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error
    logger.error('Global error occurred', error, {
      digest: error.digest,
      timestamp: new Date().toISOString(),
      critical: true,
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-4xl font-bold mb-4">500</h1>
            <p className="text-gray-400 mb-8">
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Try again"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

