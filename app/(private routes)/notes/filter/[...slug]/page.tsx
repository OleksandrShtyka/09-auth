import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] === 'all' ? 'All' : (slug?.[0] ?? 'All');
  return {
    title: `${tag} Notes | NoteHub`,
    description: `Browse ${tag.toLowerCase()} notes on NoteHub`,
    openGraph: {
      title: `${tag} Notes | NoteHub`,
      description: `Browse ${tag.toLowerCase()} notes on NoteHub`,
      url: `https://notehub.app/notes/filter/${slug?.join('/')}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const currentTag = slug?.[0];
  const activeTag = currentTag === 'all' ? undefined : currentTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', activeTag],
    queryFn: () =>
      fetchNotes({ page: 1, perPage: 12, search: '', tag: activeTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
