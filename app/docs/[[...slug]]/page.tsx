import { notFound } from 'next/navigation';
import { getDocByPath, getAllDocPaths, getAllDocs } from '@/lib/docs';
import { MDXContent } from '@/components/MDXContent';
import { DocPageClient } from '@/components/DocPageClient';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const paths = getAllDocPaths();
  return paths.map((path) => ({
    slug: path.split('/'),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const docPath = slug?.join('/') || '';
  const doc = getDocByPath(docPath);

  if (!doc) {
    return {
      title: 'Not Found',
    };
  }

  const title =
    doc.metadata.title ||
    doc.slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return {
    title,
    description: doc.metadata.description || title,
    openGraph: {
      title,
      description: doc.metadata.description || title,
      type: 'article',
    },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const docPath = slug?.join('/') || '';
  const doc = getDocByPath(docPath);
  const allDocs = getAllDocs();

  if (!doc) {
    notFound();
  }

  return <DocPageClient doc={doc} allDocs={allDocs} docPath={docPath} />;
}

