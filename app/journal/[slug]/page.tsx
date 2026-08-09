import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getJournalEntryBlocks,
  getJournalEntryBySlug,
} from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getJournalEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Journal",
    };
  }

  return {
    title: entry.title,
    description: entry.excerpt,
  };
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { slug } = await params;

  const entry = await getJournalEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const blocks = await getJournalEntryBlocks(entry.id);

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-6 py-20 md:px-12 lg:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-(--palm)">
          Journal
        </p>

        <h1 className="font-display mt-8 text-6xl leading-[0.95] tracking-tight md:text-7xl">
          {entry.title}
        </h1>

        {entry.published && (
          <time className="mt-6 block text-xs uppercase tracking-[0.2em] text-(--muted)">
            {formatDate(entry.published)}
          </time>
        )}

        <NotionRenderer blocks={blocks} />
      </article>
    </main>
  );
}