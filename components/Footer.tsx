export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col gap-3 border-t border-black/10 py-8 text-xs text-(--muted) sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Maki</p>

          <p className="font-display text-base italic">
            Thank you for being a friend. ♡
          </p>
        </div>
      </div>
    </footer>
  );
}