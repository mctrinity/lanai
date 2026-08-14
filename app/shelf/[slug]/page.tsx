import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getShelfItemBlocks,
  getShelfItemBySlug,
} from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getShelfItemBySlug(slug);

  if (!item) {
    return {
      title: "Shelf",
    };
  }

  return {
    title: `${item.title} | Shelf`,
  };
}

export default async function ShelfItemPage({
  params,
}: Props) {
  const { slug } = await params;

  const item = await getShelfItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const blocks = await getShelfItemBlocks(item.id);

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-4xl px-6 md:px-8 lg:px-0">
        <Link
          href="/shelf"
          className="mb-10 inline-block text-sm text-(--muted) transition-opacity hover:opacity-60"
        >
          ← Back to Shelf
        </Link>

        <p className="text-xs uppercase tracking-[0.25em]">
          Shelf
        </p>

        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_1.7fr] md:gap-8">
          <div>
            <h1
              className={`font-display leading-[0.95] tracking-tight ${
                item.title.length > 32
                  ? "text-5xl md:text-6xl"
                  : "text-6xl md:text-7xl"
              }`}
            >
              {item.title}
            </h1>

            {(item.creator || item.year) && (
              <p className="mt-8 text-sm tracking-wide text-(--muted)">
                {item.creator}
                {item.creator && item.year ? " · " : ""}
                {item.year}
              </p>
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