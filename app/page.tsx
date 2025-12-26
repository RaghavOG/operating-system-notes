import { getAllDocs } from '@/lib/docs';
import { HomePageClient } from '@/components/HomePageClient';

export default function HomePage() {
  const docs = getAllDocs();
  return <HomePageClient docs={docs} />;
}

