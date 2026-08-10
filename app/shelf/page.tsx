import type { Metadata } from "next";
import {
  getDisplayedShelfItems,
  type ShelfItem,
} from "@/lib/notion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shelf",
};

const typeOrder = ["Book", "Movie", "TV", "Game", "Other"];

const sectionTitles: Record<string, string> = {
  Book: "Books",
  Movie: "Movies",
  TV: "Television",
  Game: "Games",
  Other: "Other",
};

function groupShelfItems(items: ShelfItem[]) {
  return typeOrder
    .map((type) => ({
      type,
      title: sectionTitles[type],
      items: items.filter((item) => item.type === type),
    }))
    .filter((section) => section.items.length > 0);
}

export default async function ShelfPage() {
  const items = await getDisplayedShelfItems();
  const sections = groupShelfItems(items);

  return (
    <main className="px-6 py-20 md:px-12 lg:px-20">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.25em]">
          Shelf
        </p>

        <h1 className="font-display mt-8 max-w-3xl text-6xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          Things I like.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-(--muted)">
          Books, movies, television, games, and whatever else earns a
          place on the shelf.
        </p>

        <div className="mt-20">
          {sections.map((section) => (
            <section
              key={section.type}
              className="grid gap-8 border-t border-black/10 py-12 md:grid-cols-[1fr_2fr]"
            >
              <h2 className="font-display text-4xl">
                {section.title}
              </h2>

              <div>
                {section.items.map((item) => (
                  <article
                    key={item.id}
                    className="border-b border-black/10 py-6 first:pt-0"
                  >
                    <h3 className="font-display text-2xl">
                      <Link
                        href={`/shelf/${item.slug}`}
                        className="transition-opacity hover:opacity-60"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    {(item.creator || item.year) && (
                      <p className="mt-2 text-sm tracking-wide text-(--muted)">
                        {item.creator}
                        {item.creator && item.year ? " · " : ""}
                        {item.year}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}