import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center">
      <section className="mx-auto w-full max-w-7xl px-6 py-20 md:px-12 lg:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-(--palm)">
          404
        </p>

        <h1 className="font-display mt-8 max-w-3xl text-6xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          Nothing here.
        </h1>

        <p className="mt-8 max-w-md text-lg leading-8 text-(--muted)">
          Looks like you wandered a little too far from the lanai.
        </p>

        <Link
          href="/"
          className="mt-10 inline-block border-b border-(--coral) pb-1 text-sm"
        >
          Head back home
        </Link>
      </section>
    </main>
  );
}