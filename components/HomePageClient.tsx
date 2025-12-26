'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import type { Doc } from '@/lib/types';

interface HomePageClientProps {
  docs: Doc[];
}

export function HomePageClient({ docs }: HomePageClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Group docs by topic
  const topics = docs.reduce((acc, doc) => {
    const topic = doc.path.split('/')[0];
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(doc);
    return acc;
  }, {} as Record<string, Doc[]>);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar docs={docs} currentPath="" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Sidebar toggle button when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors lg:left-4"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Top bar with theme toggle */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <ThemeToggle />
        </div>

        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="mb-12">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Operating Systems Notes
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
                Comprehensive study notes for operating systems interviews at FAANG companies
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar docs={docs} />
            </div>

            <div className="space-y-8">
              {Object.entries(topics)
                .sort(([a], [b]) => {
                  // Extract topic number for sorting
                  const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                  const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                  return numA - numB;
                })
                .map(([topic, topicDocs]) => {
                  const topicName = topicDocs[0]?.path.split('/')[0] || topic;
                  const topicTitle = topicName
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <div key={topic} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/50">
                      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                        {topicTitle}
                      </h2>
                      <ul className="space-y-2">
                        {topicDocs
                          .sort((a, b) => {
                            // Sort README first, then alphabetically
                            if (a.slug === 'readme') return -1;
                            if (b.slug === 'readme') return 1;
                            return a.slug.localeCompare(b.slug);
                          })
                          .map((doc) => (
                            <li key={doc.path}>
                              <Link
                                href={`/docs/${doc.path}`}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                              >
                                <span className="text-gray-400 dark:text-gray-500">•</span>
                                <span>
                                  {doc.slug === 'readme'
                                    ? 'Overview'
                                    : doc.slug
                                        .split('-')
                                        .map(
                                          (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1)
                                        )
                                        .join(' ')}
                                </span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  );
                })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

