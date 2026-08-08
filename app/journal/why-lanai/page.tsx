import Link from "next/link";

export default function WhyLanaiPage() {
  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-6 py-20 md:px-12 lg:py-28">
        <Link
          href="/journal"
          className="text-xs uppercase tracking-[0.3em] text-(--palm) transition-opacity hover:opacity-50"
        >
          Journal
        </Link>

        <header className="mt-10">
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight md:text-7xl">
            Why Lanai?
          </h1>

          <time className="mt-6 block text-xs uppercase tracking-[0.2em] text-(--muted)">
            August 8, 2026
          </time>
        </header>

        <div className="mt-14 space-y-7 text-lg leading-8 text-(--muted)">
          <p>
            I&apos;ve had personal websites before, and for some reason I felt
            like making one again.
          </p>

          <p>
            There wasn&apos;t really a plan. I just wanted a place where I
            could put things I find interesting. Maybe something I&apos;m
            reading, an old movie I suddenly want to talk about, a game
            I&apos;m playing, or one of those random subjects I get curious
            about and end up spending far too much time looking into.
          </p>

          <p>Basically, whatever catches my attention.</p>

          <p>The name <strong>Lanai</strong> just felt right.</p>

          <p>
            A lanai is a place where you can sit, read, think, have a drink,
            talk if there&apos;s someone around — or be perfectly happy when
            there isn&apos;t. I rather like that idea.
          </p>

          <p>
            And that&apos;s pretty much what I want this website to be.
          </p>

          <p>
            It doesn&apos;t need a theme. It doesn&apos;t need to be useful.
            I don&apos;t even know yet what I&apos;ll end up putting here.
          </p>

          <p>I think that&apos;s part of the fun.</p>

          <p>So, welcome to Lanai.</p>

          <p className="font-display pt-4 text-2xl italic text-(--palm)">
            Make yourself comfortable.
          </p>
        </div>
      </article>
    </main>
  );
}