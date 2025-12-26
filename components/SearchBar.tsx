'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { Doc } from '@/lib/docs';

interface SearchBarProps {
  docs: Doc[];
}

export function SearchBar({ docs }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut: Press / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        const input = document.querySelector('input[type="text"][placeholder*="Search"]') as HTMLInputElement;
        if (input) {
          input.focus();
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredDocs = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return docs
      .filter((doc) => {
        const title = doc.slug === 'readme'
          ? 'Overview'
          : doc.slug
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
        const content = doc.content.toLowerCase();
        return title.toLowerCase().includes(lowerQuery) || content.includes(lowerQuery);
      })
      .slice(0, 10); // Limit to 10 results
  }, [query, docs]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={(e) => {
            // Don't close if clicking on a result (relatedTarget is the element receiving focus)
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (!relatedTarget || !e.currentTarget.parentElement?.contains(relatedTarget)) {
              // Use a small delay to allow click events to fire first
              setTimeout(() => setIsOpen(false), 150);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
              setQuery('');
            }
          }}
          placeholder="Search topics... (Press / to focus)"
          className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
          aria-label="Search documentation"
          aria-expanded={isOpen && filteredDocs.length > 0}
          aria-controls="search-results"
          role="combobox"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search Results */}
      {isOpen && query && filteredDocs.length > 0 && (
        <div 
          id="search-results"
          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto scrollbar-thin"
          role="listbox"
          aria-label="Search results"
          onMouseDown={(e) => {
            // Prevent blur event when clicking on results
            e.preventDefault();
          }}
        >
          {filteredDocs.map((doc) => {
            const title = doc.slug === 'readme'
              ? 'Overview'
              : doc.slug
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

            return (
              <Link
                key={doc.path}
                href={`/docs/${doc.path}`}
                className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                role="option"
                aria-label={`Go to ${title}`}
                onClick={() => {
                  // Close search and clear query on click
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">{title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {doc.path}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {isOpen && query && filteredDocs.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-500 dark:text-gray-400">
          No results found
        </div>
      )}
    </div>
  );
}

