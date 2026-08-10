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

if (!process.env.NOTION_SHELF_DATA_SOURCE_ID) {
  throw new Error(
    "NOTION_SHELF_DATA_SOURCE_ID is not defined"
  );
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const journalDataSourceId =
  process.env.NOTION_JOURNAL_DATA_SOURCE_ID;

const shelfDataSourceId =
  process.env.NOTION_SHELF_DATA_SOURCE_ID;

export type JournalEntry = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: string | null;
};

export type ShelfItem = {
  id: string;
  title: string;
  creator: string;
  type: string;
  year: number | null;
  featured: boolean;
  sort: number | null;
  slug: string;
};

/*
 * A normal Notion block plus any nested child blocks
 * that we fetch recursively.
 */
export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[];
};

/*
 * Extract plain text from a Notion title or rich-text property.
 */
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

/*
 * Extract a value from a Notion select property.
 */
function getSelectValue(property: unknown): string {
  if (
    !property ||
    typeof property !== "object" ||
    !("type" in property) ||
    property.type !== "select" ||
    !("select" in property)
  ) {
    return "";
  }

  const select = property.select;

  if (
    !select ||
    typeof select !== "object" ||
    !("name" in select) ||
    typeof select.name !== "string"
  ) {
    return "";
  }

  return select.name;
}

/*
 * Extract a value from a Notion number property.
 */
function getNumberValue(property: unknown): number | null {
  if (
    !property ||
    typeof property !== "object" ||
    !("type" in property) ||
    property.type !== "number" ||
    !("number" in property)
  ) {
    return null;
  }

  return typeof property.number === "number"
    ? property.number
    : null;
}

/*
 * Extract a value from a Notion checkbox property.
 */
function getCheckboxValue(property: unknown): boolean {
  if (
    !property ||
    typeof property !== "object" ||
    !("type" in property) ||
    property.type !== "checkbox" ||
    !("checkbox" in property)
  ) {
    return false;
  }

  return typeof property.checkbox === "boolean"
    ? property.checkbox
    : false;
}

/*
 * JOURNAL
 */

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

/*
 * SHELF
 */

export async function getDisplayedShelfItems(): Promise<
  ShelfItem[]
> {
  const response = await notion.dataSources.query({
    data_source_id: shelfDataSourceId,
    filter: {
      property: "Display",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Sort",
        direction: "ascending",
      },
    ],
  });

  return response.results
    .filter((page) => "properties" in page)
    .map((page) => {
      const properties = page.properties;

      return {
        id: page.id,
        title: getPlainText(properties.Title),
        creator: getPlainText(properties.Creator),
        type: getSelectValue(properties.Type),
        year: getNumberValue(properties.Year),
        featured: getCheckboxValue(
          properties.Featured
        ),
        sort: getNumberValue(properties.Sort),
        slug: getPlainText(properties.Slug),
      };
    });
}

export async function getShelfItemBySlug(
  slug: string
): Promise<ShelfItem | null> {
  const response = await notion.dataSources.query({
    data_source_id: shelfDataSourceId,
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
        {
          property: "Display",
          checkbox: {
            equals: true,
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

  return {
    id: page.id,
    title: getPlainText(properties.Title),
    creator: getPlainText(properties.Creator),
    type: getSelectValue(properties.Type),
    year: getNumberValue(properties.Year),
    featured: getCheckboxValue(properties.Featured),
    sort: getNumberValue(properties.Sort),
    slug: getPlainText(properties.Slug),
  };
}

export async function getShelfItemBlocks(
  pageId: string
): Promise<NotionBlock[]> {
  return getBlockChildren(pageId);
}