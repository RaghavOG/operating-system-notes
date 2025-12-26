/**
 * Environment variable validation and configuration
 */

const requiredEnvVars = [] as const;
const optionalEnvVars = ['NEXT_PUBLIC_SITE_URL'] as const;

type OptionalEnvVar = typeof optionalEnvVars[number];

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Get environment variable with fallback
 */
export function getEnv(key: OptionalEnvVar, fallback: string): string {
  return process.env[key] || fallback;
}

/**
 * Environment configuration
 */
export const env = {
  siteUrl: getEnv('NEXT_PUBLIC_SITE_URL', 'https://operating-system-notes.vercel.app'),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Validate environment variables on module load (only in production)
if (process.env.NODE_ENV === 'production') {
  try {
    validateEnv();
  } catch (error) {
    console.error('Environment validation failed:', error);
    // Don't throw in production to avoid breaking the app
    // but log the error for debugging
  }
}

