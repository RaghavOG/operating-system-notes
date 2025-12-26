'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { MDXContent } from '@/components/MDXContent';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TableOfContents } from '@/components/TableOfContents';
import { ScrollToTop } from '@/components/ScrollToTop';
import { MobileTOC } from '@/components/MobileTOC';
import type { Doc } from '@/lib/docs';

interface DocPageClientProps {
  doc: Doc;
  allDocs: Doc[];
  docPath: string;
}

export function DocPageClient({ doc, allDocs, docPath }: DocPageClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar docs={allDocs} currentPath={docPath} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Sidebar toggle button when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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

        {/* Mobile TOC Toggle */}
        <MobileTOC content={doc.content} />

        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
          <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 ${sidebarOpen ? 'xl:mr-64' : ''}`}>
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center flex-wrap gap-2 text-gray-500 dark:text-gray-400">
                <li>
                  <Link 
                    href="/" 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-700 dark:text-gray-300">
                  {docPath.split('/').map((part, i, arr) => (
                    <span key={i}>
                      {part
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                      {i < arr.length - 1 && <span aria-hidden="true"> / </span>}
                    </span>
                  ))}
                </li>
              </ol>
            </nav>

            <article className="prose prose-lg dark:prose-invert max-w-none">
              <MDXContent content={doc.content} currentPath={docPath} />
            </article>
          </div>
        </main>

        {/* Table of Contents */}
        <aside className="hidden xl:block fixed right-0 top-0 h-full w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto scrollbar-thin">
          <TableOfContents content={doc.content} />
        </aside>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </div>
  );
}

