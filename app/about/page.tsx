import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-(--palm)">
          About
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-12">
          <div>
            <h1 className="font-display text-6xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              So, a little
              <br />
              about me.
            </h1>
          </div>

          <div className="max-w-2xl">
            <p className="font-display text-3xl leading-snug md:text-4xl">
              I&apos;m Maki. A bit of a nerd, quite happy in my own company,
              and easily distracted by anything I find interesting.
            </p>

            <div className="mt-10 space-y-6 text-base leading-8 text-(--muted)">
              <p>
                Give me a good book, movie, TV series, or an interesting rabbit
                hole to disappear into and I&apos;m perfectly content.
              </p>

              <p>
                I love science fiction in almost any form: books, movies, TV
                shows, comedy or drama. Michael Crichton, Stephen King, and
                Isaac Asimov are longtime favorites.
              </p>

              <p>
                I play video games when I feel like it, usually single-player.
                Apparently I&apos;m not particularly sociable in fictional
                worlds either.
              </p>

              <p>
                I have a habit of getting interested in things and wanting to
                know how they work, why they work, or why they went horribly
                wrong.
              </p>

              <p className="font-display text-2xl italic text-(--palm)">
                Anyway, that&apos;s probably enough about me.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-(--blush)">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:py-20">
          <div className="grid gap-10 md:grid-cols-3">
            <Link
              href="/shelf"
              className="group transition-opacity hover:opacity-60"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-(--palm)">
                Shelf
              </p>

              <p className="font-display mt-4 text-3xl">
                Things I&apos;ve enjoyed.
              </p>
            </Link>

            <Link
              href="/journal"
              className="group transition-opacity hover:opacity-60"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-(--palm)">
                Journal
              </p>

              <p className="font-display mt-4 text-3xl">
                Things I&apos;ve been thinking about.
              </p>
            </Link>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-(--palm)">
                Photos
              </p>

              <p className="font-display mt-4 text-3xl">
                Things I&apos;ve seen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}