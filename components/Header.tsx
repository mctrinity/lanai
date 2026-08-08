import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-start justify-between px-6 py-8 md:px-12">
      <Link href="/" className="group">
        <span className="font-display block text-3xl font-medium tracking-tight">
          Lanai
        </span>

        <span className="mt-1 block text-xs text-(--muted)">
          A little place on the internet.
        </span>
      </Link>

      <nav className="flex gap-7 pt-2 text-sm">
        <Link className="transition-opacity hover:opacity-50" href="/about">
          About
        </Link>

        <Link className="transition-opacity hover:opacity-50" href="/journal">
          Journal
        </Link>

        <Link className="transition-opacity hover:opacity-50" href="/photos">
          Photos
        </Link>
      </nav>
    </header>
  );
}