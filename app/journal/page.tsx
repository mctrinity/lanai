import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedJournalEntries } from "@/lib/notion";

export const metadata: Metadata = {
  title: "Journal",
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

export default async function JournalPage() {
  const entries = await getPublishedJournalEntries();

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-(--palm)">
          Journal
        </p>

        <h1 className="font-display mt-8 max-w-3xl text-6xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          Things worth writing down.
        </h1>

        <div className="mt-20 max-w-4xl">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="grid gap-4 border-t border-black/10 py-10 md:grid-cols-[180px_1fr]"
            >
              <time className="text-xs uppercase tracking-[0.2em] text-(--muted)">
                {formatDate(entry.published)}
              </time>

              <div>
                <h2 className="font-display text-4xl tracking-tight">
                  <Link
                    href={`/journal/${entry.slug}`}
                    className="transition-opacity hover:opacity-50"
                  >
                    {entry.title}
                  </Link>
                </h2>

                <p className="mt-3 max-w-xl leading-7 text-(--muted)">
                  {entry.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}