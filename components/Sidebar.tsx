'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import type { Doc } from '@/lib/docs';

interface SidebarProps {
  docs: Doc[];
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ docs, currentPath, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Group docs by topic
  const topics = docs.reduce((acc, doc) => {
    const topic = doc.path.split('/')[0];
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(doc);
    return acc;
  }, {} as Record<string, Doc[]>);

  // State for expanded topics - initialize with current topic expanded
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(() => {
    const currentTopic = currentPath.split('/')[0];
    return new Set([currentTopic]);
  });

  // Auto-expand the topic containing the current path
  useEffect(() => {
    const currentTopic = currentPath.split('/')[0];
    if (currentTopic) {
      setExpandedTopics((prev) => new Set([...prev, currentTopic]));
    }
  }, [currentPath]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Mobile menu button - only show when sidebar is open on mobile */}
      {isOpen && (
        <button
          onClick={() => onClose()}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 dark:bg-gray-800 rounded-md text-gray-300 hover:bg-gray-700"
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          overflow-y-auto z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'}
          scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              onClick={() => onClose()}
            >
              Operating Systems Notes
            </Link>
            {/* Toggle button for desktop */}
            <button
              onClick={onClose}
              className="hidden lg:block p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
              title={isOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark';
                  setTheme(newTheme);
                  // Force update the HTML class immediately
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(newTheme);
                }}
                className="w-full flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
              >
                <span>Theme</span>
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          )}

          <nav className="space-y-2">
            {Object.entries(topics)
              .sort(([a], [b]) => {
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
                const isExpanded = expandedTopics.has(topic);

                return (
                  <div key={topic} className="border-b border-gray-200 dark:border-gray-800 pb-2">
                    <button
                      onClick={() => toggleTopic(topic)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      aria-expanded={isExpanded}
                      aria-controls={`topic-${topic}-content`}
                    >
                      <span className="uppercase tracking-wider">{topicTitle}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <ul
                      id={`topic-${topic}-content`}
                      className={`space-y-1 mt-1 overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                      aria-hidden={!isExpanded}
                    >
                      {topicDocs
                        .sort((a, b) => {
                          if (a.slug === 'readme') return -1;
                          if (b.slug === 'readme') return 1;
                          return a.slug.localeCompare(b.slug);
                        })
                        .map((doc) => {
                          const href = `/docs/${doc.path}`;
                          const isActive = pathname === href;

                          return (
                            <li key={doc.path}>
                              <Link
                                href={href}
                                onClick={() => onClose()}
                                className={`
                                  block px-3 py-2 ml-4 rounded-md text-sm
                                  transition-colors
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                                  ${
                                    isActive
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                  }
                                `}
                              >
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
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                );
              })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}
    </>
  );
}

