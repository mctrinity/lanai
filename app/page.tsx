import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      
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

      <section id="about" className="bg-(--sage)">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-[1fr_2fr] md:px-12 lg:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-(--palm)">
              About
            </p>
          </div>

          <div>
            <h2 className="font-display max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl">
              Nice to have you here.
            </h2>

            <div className="mt-8 max-w-xl space-y-5 text-base leading-8 text-(--ink)">
              <p>
                I&apos;m Maki. Lanai is where I collect photographs, stories,
                things I&apos;m enjoying, and little pieces of everyday life
                worth keeping.
              </p>

              <p>
                Stay awhile. There&apos;s always room on the lanai.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}