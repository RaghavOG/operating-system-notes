'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Link from 'next/link';

interface MDXContentProps {
  content: string;
  currentPath?: string;
}

export function MDXContent({ content, currentPath = '' }: MDXContentProps) {
  // Convert markdown relative paths to Next.js routes
  const resolveLink = (href: string): string => {
    // External links
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
      return href;
    }

    // Anchor links (same page)
    if (href.startsWith('#')) {
      return href;
    }

    // Normalize: strip .md extension from all links (case-insensitive)
    let normalizedHref = href.replace(/\.md$/i, '').replace(/\.MD$/i, '');

    // Handle relative paths
    if (currentPath) {
      const pathParts = currentPath.split('/').filter(Boolean);
      const currentDir = pathParts.slice(0, -1).join('/');
      
      // Handle README or readme (same directory)
      if (normalizedHref === 'README' || normalizedHref === 'readme' || normalizedHref === './README' || normalizedHref === './readme') {
        return currentDir ? `/docs/${currentDir}/readme` : '/docs/readme';
      }

      // Handle INDEX (main index) - check if it's in the path
      if (normalizedHref.includes('INDEX') || normalizedHref.includes('index')) {
        // Count ../ to determine how many levels up
        const upLevels = (normalizedHref.match(/\.\.\//g) || []).length;
        if (upLevels >= pathParts.length || normalizedHref.includes('INDEX')) {
          return '/';
        }
      }

      // Handle parent directory navigation (../../)
      if (normalizedHref.startsWith('../')) {
        const levels = (normalizedHref.match(/\.\.\//g) || []).length;
        const newPathParts = pathParts.slice(0, -levels);
        const fileName = normalizedHref.replace(/\.\.\//g, '').toLowerCase();
        
        if (fileName === 'index' || fileName === 'readme') {
          if (newPathParts.length === 0) {
            return '/';
          }
          return `/docs/${newPathParts.join('/')}/readme`;
        }
        
        if (newPathParts.length === 0) {
          return `/docs/${fileName}`;
        }
        return `/docs/${newPathParts.join('/')}/${fileName}`;
      }

      // Handle same directory files (./filename or filename)
      if (normalizedHref.startsWith('./') || (!normalizedHref.includes('/') && normalizedHref.length > 0)) {
        const fileName = normalizedHref.replace('./', '').toLowerCase();
        if (currentDir) {
          return `/docs/${currentDir}/${fileName}`;
        }
        return `/docs/${fileName}`;
      }

      // Handle relative paths with directory (e.g., topic-02-kernel-architecture/README)
      if (normalizedHref.includes('/') && !normalizedHref.startsWith('http')) {
        const parts = normalizedHref.split('/');
        const fileName = parts[parts.length - 1].toLowerCase();
        const dirParts = parts.slice(0, -1);
        
        // Build the full path
        const fullPathParts = currentDir ? [...currentDir.split('/'), ...dirParts] : dirParts;
        const fullPath = fullPathParts.filter(Boolean).join('/');
        
        if (fileName === 'index' || fileName === 'readme') {
          return fullPath ? `/docs/${fullPath}/readme` : '/';
        }
        
        return fullPath ? `/docs/${fullPath}/${fileName}` : `/docs/${fileName}`;
      }
    }

    // Default: assume it's a relative path from root
    const cleanHref = normalizedHref.replace(/^\.\//, '').toLowerCase();
    if (cleanHref === 'index' || cleanHref === 'readme' || cleanHref === '') {
      return '/';
    }
    return `/docs/${cleanHref}`;
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'prepend',
            properties: {
              className: ['anchor'],
              ariaHidden: true,
            },
            content: {
              type: 'text',
              value: '# ',
            },
          },
        ],
        rehypeHighlight,
      ]}
      components={{
        a: ({ node, href, ...props }) => {
          const resolvedHref = resolveLink(href || '');
          
          // External links
          if (resolvedHref.startsWith('http://') || resolvedHref.startsWith('https://') || resolvedHref.startsWith('mailto:')) {
            return (
              <a
                href={resolvedHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                {...props}
              />
            );
          }

          // Internal links
          return (
            <Link
              href={resolvedHref}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

