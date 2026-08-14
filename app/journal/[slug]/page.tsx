import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getJournalEntryBlocks,
  getJournalEntryBySlug,
} from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";
import Link from "next/link";

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
      <article className="mx-auto max-w-4xl px-6 md:px-8 lg:px-0">
        <Link
          href="/journal"
          className="mb-10 inline-block text-sm text-(--muted) transition-opacity hover:opacity-60"
        >
          ← Back to Journal
        </Link>

        <p className="text-xs uppercase tracking-[0.25em]">
          Journal
        </p>

        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_1.7fr] md:gap-8">
          <div>
            <h1
              className={`font-display leading-[0.95] tracking-tight ${
                entry.title.length > 32
                  ? "text-5xl md:text-6xl"
                  : "text-6xl md:text-7xl"
              }`}
            >
              {entry.title}
            </h1>

            {entry.published && (
              <time className="mt-8 block text-xs uppercase tracking-[0.2em] text-(--muted)">
                {formatDate(entry.published)}
              </time>
            )}
          </div>

          <div>
            <NotionRenderer blocks={blocks} flushTop />
          </div>
        </div>
      </article>
    </main>
  );
}