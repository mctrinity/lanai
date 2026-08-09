import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const dataSourceId = process.env.NOTION_JOURNAL_DATA_SOURCE_ID;

if (!dataSourceId) {
  throw new Error("NOTION_JOURNAL_DATA_SOURCE_ID is missing");
}

const response = await notion.dataSources.query({
  data_source_id: dataSourceId,
  filter: {
    property: "Status",
    select: {
      equals: "Published",
    },
  },
});

console.log(`Found ${response.results.length} published journal entry/entries`);

for (const page of response.results) {
  if (!("properties" in page)) continue;

  const titleProperty = page.properties.Title;

  const title =
    titleProperty?.type === "title"
      ? titleProperty.title.map((item) => item.plain_text).join("")
      : "";

  console.log(`\n--- ${title} ---\n`);

  const blocks = await notion.blocks.children.list({
    block_id: page.id,
    page_size: 100,
  });

  for (const block of blocks.results) {
    if (!("type" in block)) continue;

    if (block.type === "paragraph") {
      const text = block.paragraph.rich_text
        .map((item) => item.plain_text)
        .join("");

      console.log(text);
      console.log();
    }
  }
}