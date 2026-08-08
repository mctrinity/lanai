import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-start justify-between px-6 py-6 md:px-12">
      <Link href="/" className="block">
        <div className="w-28 sm:w-32">
          <Image
            src="/images/branding/lanai-logo.png"
            alt="Lanai"
            width={625}
            height={520}
            priority
            className="h-auto w-full"
          />
        </div>
      </Link>

      <nav className="flex gap-4 pt-2 text-sm sm:gap-7">
        <Link
          className="transition-opacity hover:opacity-50"
          href="/about"
        >
          About
        </Link>

        <Link
          className="transition-opacity hover:opacity-50"
          href="/journal"
        >
          Journal
        </Link>

        <Link
          className="transition-opacity hover:opacity-50"
          href="/shelf"
        >
          Shelf
        </Link>
      </nav>
    </header>
  );
}