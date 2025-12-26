import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { logger } from './logger';
import { contentConfig } from './config';
import type { Doc, DocMetadata } from './types';

const contentDirectory = path.join(process.cwd(), contentConfig.contentDirectory);

// Types are now imported from ./types

/**
 * Get all markdown files from the content directory recursively
 * @throws {Error} If content directory doesn't exist or can't be read
 */
export function getAllDocs(): Doc[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      logger.error('Content directory does not exist', undefined, { contentDirectory });
      throw new Error(`Content directory not found: ${contentDirectory}`);
    }

    const docs: Doc[] = [];

    function walkDir(dir: string, basePath: string = '') {
      try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            const newBasePath = basePath ? `${basePath}/${file}` : file;
            walkDir(filePath, newBasePath);
          } else if (file.endsWith('.md')) {
            try {
              // Normalize README.md to readme for consistent paths
              const fileName = file.replace('.md', '').toLowerCase();
              const fullPath = basePath ? `${basePath}/${fileName}` : fileName;
              const fileContents = fs.readFileSync(filePath, 'utf8');
              const { data, content } = matter(fileContents);

              docs.push({
                path: fullPath,
                slug: path.basename(fullPath),
                content,
                metadata: data as DocMetadata,
              });
            } catch (error) {
              logger.warn('Failed to parse markdown file', { filePath, error });
            }
          }
        }
      } catch (error) {
        logger.error('Error reading directory', error, { dir });
        throw error;
      }
    }

    walkDir(contentDirectory);
    logger.debug(`Loaded ${docs.length} documentation files`);
    return docs;
  } catch (error) {
    logger.error('Failed to load documentation files', error);
    throw error;
  }
}

/**
 * Get a single doc by path
 * @param docPath - The path to the document (e.g., 'topic-01-os-philosophy-design/01-os-philosophy-overview')
 * @returns The document or null if not found
 */
export function getDocByPath(docPath: string): Doc | null {
  try {
    // Try to find the doc
    const allDocs = getAllDocs();
    // Normalize the path (remove leading/trailing slashes, handle empty strings, lowercase)
    const normalizedPath = docPath
      .trim()
      .replace(/^\/+|\/+$/g, '')
      .toLowerCase();
    const doc = allDocs.find((d) => d.path.toLowerCase() === normalizedPath);

    if (!doc) {
      logger.debug('Document not found', { docPath, normalizedPath });
      // Debug: log available paths if not found (only in dev)
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Available paths sample', {
          sample: allDocs.map(d => d.path).slice(0, 10),
        });
      }
      return null;
    }

    return doc;
  } catch (error) {
    logger.error('Error getting document by path', error, { docPath });
    return null;
  }
}

/**
 * Get all paths for static generation
 * @returns Array of document paths
 */
export function getAllDocPaths(): string[] {
  try {
    const docs = getAllDocs();
    return docs.map((doc) => doc.path);
  } catch (error) {
    logger.error('Failed to get all document paths', error);
    return [];
  }
}

