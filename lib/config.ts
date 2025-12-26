/**
 * Application configuration and constants
 */

export const siteConfig = {
  name: 'Operating Systems Notes',
  description: 'Comprehensive study notes for operating systems interviews at FAANG companies',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://operating-system-notes.vercel.app',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/RaghavOG/operating-system-notes',
    twitter: 'https://twitter.com',
  },
  author: {
    name: 'Raghav Singla',
    url: 'https://github.com/RaghavOG',
  },
} as const;

export const contentConfig = {
  contentDirectory: 'content',
  supportedFileExtensions: ['.md'],
  defaultMetadata: {
    title: 'Operating Systems Notes',
    description: 'Comprehensive study notes for operating systems interviews at FAANG companies',
  },
} as const;

export const uiConfig = {
  theme: {
    defaultTheme: 'dark' as const,
    storageKey: 'operating-system-theme',
  },
  sidebar: {
    width: 256, // 64 * 4 (w-64)
    mobileBreakpoint: 1024, // lg breakpoint
  },
  toc: {
    offset: 100,
    scrollOffset: 20,
  },
} as const;

export const seoConfig = {
  defaultTitle: 'Operating Systems Notes',
  titleTemplate: '%s | Operating Systems Notes',
  defaultDescription: 'Comprehensive study notes for operating systems interviews at FAANG companies',
  keywords: [
    'operating systems',
    'OS',
    'kernel',
    'FAANG interviews',
    'process management',
    'memory management',
    'scheduling',
    'interview preparation',
    'system calls',
    'virtual memory',
    'file systems',
    'concurrency',
    'synchronization',
  ],
} as const;

