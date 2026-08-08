import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shelf",
};

const shelf = [
  {
  title: "Books",
  items: [
    {
      name: "Michael Crichton",
      note: "Science, technology, and things going terribly wrong.",
    },
    {
      name: "Stephen King",
      note: "Horror, strange things, and very human characters.",
    },
    {
      name: "Isaac Asimov",
      note: "Robots, ideas, and questions that are still interesting.",
    },
    {
      name: "Anne of Green Gables",
      note: "I never seem to outgrow Anne.",
    },
  ],
},
  {
    title: "Movies & TV",
    items: [
      {
        name: "The China Syndrome",
        note: "I have a particular soft spot for Jack Godell.",
      },
    ],
  },
  {
    title: "Games",
    items: [
      {
        name: "Single-player, mostly",
        note: "I'll fill this shelf as I remember what belongs here.",
      },
    ],
  },
];

export default function ShelfPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-(--palm)">
          Shelf
        </p>

        <h1 className="font-display mt-8 max-w-3xl text-6xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          Things I like.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-(--muted)">
          Books, movies, television, games, and whatever else earns a place
          on the shelf.
        </p>

        <div className="mt-20">
          {shelf.map((section) => (
            <section
              key={section.title}
              className="grid gap-8 border-t border-black/10 py-12 md:grid-cols-[1fr_2fr]"
            >
              <h2 className="font-display text-4xl">
                {section.title}
              </h2>

              <div>
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="border-b border-black/10 py-6 first:pt-0"
                  >
                    <h3 className="font-display text-2xl">
                      {item.name}
                    </h3>

                    <p className="mt-2 max-w-xl leading-7 text-(--muted)">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}