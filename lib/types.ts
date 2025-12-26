/**
 * Shared TypeScript types and interfaces
 */

export interface DocMetadata {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
  [key: string]: any;
}

export interface Doc {
  path: string;
  slug: string;
  content: string;
  metadata: DocMetadata;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface SearchResult {
  doc: Doc;
  score: number;
  matches: {
    field: 'title' | 'content';
    text: string;
  }[];
}

export interface NavigationItem {
  title: string;
  path: string;
  children?: NavigationItem[];
}

export type Theme = 'light' | 'dark';

export interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

