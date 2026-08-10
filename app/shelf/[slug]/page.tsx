import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getShelfItemBlocks,
  getShelfItemBySlug,
} from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";
import Link from "next/link";

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
    <main className="px-6 py-20 md:px-12 lg:px-20">
      <article className="mx-auto max-w-4xl">
        <Link
            href="/shelf"
            className="mb-10 inline-block text-sm text-(--muted) transition-opacity hover:opacity-60"
        >
            ← Back to Shelf
        </Link>

        <p className="text-xs uppercase tracking-[0.25em]">
            Shelf
        </p>

        <h1 className="font-display mt-8 text-6xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          {item.title}
        </h1>

        {(item.creator || item.year) && (
          <p className="mt-6 text-sm tracking-wide text-(--muted)">
            {item.creator}
            {item.creator && item.year ? " · " : ""}
            {item.year}
          </p>
        )}

        <div className="mt-16">
          <NotionRenderer blocks={blocks} />
        </div>
      </article>
    </main>
  );
}