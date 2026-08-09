import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

if (!process.env.NOTION_TOKEN) {
  throw new Error("NOTION_TOKEN is not defined");
}

if (!process.env.NOTION_JOURNAL_DATA_SOURCE_ID) {
  throw new Error(
    "NOTION_JOURNAL_DATA_SOURCE_ID is not defined"
  );
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const journalDataSourceId =
  process.env.NOTION_JOURNAL_DATA_SOURCE_ID;

export type JournalEntry = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: string | null;
};

/*
 * A normal Notion block plus any nested child blocks
 * that we fetch recursively.
 */
export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[];
};

function getPlainText(property: unknown): string {
  if (
    property &&
    typeof property === "object" &&
    "type" in property
  ) {
    const prop = property as {
      type: string;
      title?: Array<{ plain_text: string }>;
      rich_text?: Array<{ plain_text: string }>;
    };

    if (prop.type === "title") {
      return (
        prop.title
          ?.map((item) => item.plain_text)
          .join("") ?? ""
      );
    }

    if (prop.type === "rich_text") {
      return (
        prop.rich_text
          ?.map((item) => item.plain_text)
          .join("") ?? ""
      );
    }
  }

  return "";
}

export async function getPublishedJournalEntries(): Promise<
  JournalEntry[]
> {
  const response = await notion.dataSources.query({
    data_source_id: journalDataSourceId,
    filter: {
      property: "Status",
      select: {
        equals: "Published",
      },
    },
    sorts: [
      {
        property: "Published",
        direction: "descending",
      },
    ],
  });

  return response.results
    .filter((page) => "properties" in page)
    .map((page) => {
      const properties = page.properties;

      const publishedProperty = properties.Published;

      const published =
        publishedProperty?.type === "date"
          ? publishedProperty.date?.start ?? null
          : null;

      return {
        id: page.id,
        title: getPlainText(properties.Title),
        slug: getPlainText(properties.Slug),
        excerpt: getPlainText(properties.Excerpt),
        published,
      };
    });
}

export async function getJournalEntryBySlug(
  slug: string
): Promise<JournalEntry | null> {
  const response = await notion.dataSources.query({
    data_source_id: journalDataSourceId,
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
        {
          property: "Status",
          select: {
            equals: "Published",
          },
        },
      ],
    },
    page_size: 1,
  });

  const page = response.results.find(
    (result) => "properties" in result
  );

  if (!page || !("properties" in page)) {
    return null;
  }

  const properties = page.properties;
  const publishedProperty = properties.Published;

  return {
    id: page.id,
    title: getPlainText(properties.Title),
    slug: getPlainText(properties.Slug),
    excerpt: getPlainText(properties.Excerpt),
    published:
      publishedProperty?.type === "date"
        ? publishedProperty.date?.start ?? null
        : null,
  };
}

/*
 * Fetch all children for a block/page.
 *
 * Notion nested content (such as a sub-bullet) is stored
 * as children of its parent block rather than alongside
 * the top-level blocks.
 */
async function getBlockChildren(
  blockId: string
): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });

    const fullBlocks = response.results.filter(
      (block): block is BlockObjectResponse =>
        "type" in block
    );

    for (const block of fullBlocks) {
      const notionBlock: NotionBlock = {
        ...block,
      };

      if (block.has_children) {
        notionBlock.children = await getBlockChildren(
          block.id
        );
      }

      blocks.push(notionBlock);
    }

    cursor = response.has_more
      ? response.next_cursor ?? undefined
      : undefined;
  } while (cursor);

  return blocks;
}

export async function getJournalEntryBlocks(
  pageId: string
): Promise<NotionBlock[]> {
  return getBlockChildren(pageId);
}