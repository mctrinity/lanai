import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-start justify-between px-6 py-8 md:px-12">
        <Link href="/" className="group">
          <span className="font-display block text-3xl font-medium tracking-tight">
            Lanai
          </span>

          <span className="mt-1 block text-xs text-(--muted)">
            A little place on the internet.
          </span>
        </Link>

        <nav className="flex gap-7 pt-2 text-sm">
          <a className="transition-opacity hover:opacity-50" href="#about">
            About
          </a>

          <a className="transition-opacity hover:opacity-50" href="#journal">
            Journal
          </a>

          <a className="transition-opacity hover:opacity-50" href="#photos">
            Photos
          </a>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[75vh] max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-12">
        <div>
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-(--palm)">
            Life, lately
          </p>

          <h1 className="font-display text-7xl leading-[0.9] tracking-tight md:text-8xl lg:text-9xl">
            Hello,
            <br />
            I&apos;m Maki.
          </h1>

          <p className="mt-8 max-w-md text-lg leading-8 text-(--muted)">
            A quiet corner for photographs, stories, things I love, and whatever else finds its way here.
          </p>

          <a
            href="#about"
            className="mt-10 inline-block border-b border-(--coral) pb-1 text-sm"
          >
            Come on in
          </a>
        </div>

        <div className="relative mx-auto aspect-4/5 w-full max-w-lg">
          <Image
            src="/images/home/hero.png"
            alt="A sunny tropical lanai"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      </section>
    </main>
  );
}