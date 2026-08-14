import type {
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import type { NotionBlock } from "@/lib/notion";

type Props = {
  blocks: NotionBlock[];
  nested?: boolean;
  flushTop?: boolean;
};

function renderRichText(richText: RichTextItemResponse[]) {
  return richText.map((text, index) => {
    let content: React.ReactNode = text.plain_text;

    if (text.annotations.bold) {
      content = <strong>{content}</strong>;
    }

    if (text.annotations.italic) {
      content = <em>{content}</em>;
    }

    if (text.annotations.strikethrough) {
      content = <s>{content}</s>;
    }

    if (text.annotations.underline) {
      content = <u>{content}</u>;
    }

    if (text.annotations.code) {
      content = (
        <code className="rounded bg-black/5 px-1.5 py-0.5 text-[0.9em]">
          {content}
        </code>
      );
    }

    if ("href" in text && text.href) {
      content = (
        <a
          href={text.href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-(--coral) transition-opacity hover:opacity-60"
        >
          {content}
        </a>
      );
    }

    return <span key={index}>{content}</span>;
  });
}

export default function NotionRenderer({
  blocks,
  nested = false,
  flushTop = false,
}: Props) {
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    /*
     * Bulleted lists
     */
    if (block.type === "bulleted_list_item") {
      const items: NotionBlock[] = [];

      while (
        i < blocks.length &&
        blocks[i].type === "bulleted_list_item"
      ) {
        items.push(blocks[i]);
        i++;
      }

      i--;

      elements.push(
        <ul
          key={block.id}
          className={
            nested
              ? "space-y-2 pl-5"
              : "space-y-2 pl-5"
          }
        >
          {items.map((item) => {
            if (item.type !== "bulleted_list_item") {
              return null;
            }

            return (
              <li
                key={item.id}
                className={
                    nested
                    ? "relative pl-4 before:absolute before:left-0 before:content-['◦']"
                    : "relative pl-4 before:absolute before:left-0 before:content-['•']"
                }
            >
                {renderRichText(
                  item.bulleted_list_item.rich_text
                )}

                {item.children &&
                  item.children.length > 0 && (
                    <div className="mt-2">
                      <NotionRenderer
                        blocks={item.children}
                        nested
                      />
                    </div>
                  )}
              </li>
            );
          })}
        </ul>
      );

      continue;
    }

    /*
     * Numbered lists
     */
    if (block.type === "numbered_list_item") {
      const items: NotionBlock[] = [];

      while (
        i < blocks.length &&
        blocks[i].type === "numbered_list_item"
      ) {
        items.push(blocks[i]);
        i++;
      }

      i--;

      elements.push(
        <ol
          key={block.id}
          className="list-decimal space-y-2 pl-6"
        >
          {items.map((item) => {
            if (item.type !== "numbered_list_item") {
              return null;
            }

            return (
              <li key={item.id}>
                {renderRichText(
                  item.numbered_list_item.rich_text
                )}

                {item.children &&
                  item.children.length > 0 && (
                    <div className="mt-2">
                      <NotionRenderer
                        blocks={item.children}
                        nested
                      />
                    </div>
                  )}
              </li>
            );
          })}
        </ol>
      );

      continue;
    }

    switch (block.type) {
      case "paragraph":
        elements.push(
          <p key={block.id}>
            {renderRichText(
              block.paragraph.rich_text
            )}
          </p>
        );
        break;

      case "heading_1":
        elements.push(
          <h2
            key={block.id}
            className="font-display pt-8 text-4xl tracking-tight text-(--ink)"
          >
            {renderRichText(
              block.heading_1.rich_text
            )}
          </h2>
        );
        break;

      case "heading_2":
        elements.push(
          <h3
            key={block.id}
            className="font-display pt-6 text-3xl tracking-tight text-(--ink)"
          >
            {renderRichText(
              block.heading_2.rich_text
            )}
          </h3>
        );
        break;

      case "heading_3":
        elements.push(
          <h4
            key={block.id}
            className="pt-4 text-lg font-semibold text-(--ink)"
          >
            {renderRichText(
              block.heading_3.rich_text
            )}
          </h4>
        );
        break;

      case "quote":
        elements.push(
          <blockquote
            key={block.id}
            className="font-display text-2xl italic leading-relaxed text-(--palm)"
          >
            {renderRichText(
              block.quote.rich_text
            )}
          </blockquote>
        );
        break;

      case "divider":
        elements.push(
          <hr
            key={block.id}
            className="my-12 border-0 border-t border-black/10"
          />
        );
        break;

      case "image": {
        const src =
          block.image.type === "external"
            ? block.image.external.url
            : block.image.file.url;

        const caption = block.image.caption
          .map((item) => item.plain_text)
          .join("");

        elements.push(
          <figure key={block.id} className="py-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={caption || ""}
                className="h-auto max-w-full rounded-sm"
            />

            {caption && (
                <figcaption className="mt-3 text-sm italic text-(--muted)">
                {caption}
                </figcaption>
            )}
          </figure>
        );

        break;
      }

      default:
        break;
    }
  }

  return (
    <div
      className={
        nested
          ? "space-y-2"
          : `${
              flushTop ? "" : "mt-14"
            } space-y-7 text-[17px] leading-8 text-(--muted)`
      }
    >
      {elements}
    </div>
  );
}