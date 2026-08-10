import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const dataSourceId = process.env.NOTION_SHELF_DATA_SOURCE_ID;

if (!dataSourceId) {
  throw new Error("NOTION_SHELF_DATA_SOURCE_ID is missing");
}

const response = await notion.dataSources.query({
  data_source_id: dataSourceId,
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

console.log(
  `Found ${response.results.length} displayed shelf item(s)`
);

for (const page of response.results) {
  if (!("properties" in page)) continue;

  const properties = page.properties;

  const title =
    properties.Title?.type === "title"
      ? properties.Title.title
          .map((item) => item.plain_text)
          .join("")
      : "";

  const creator =
    properties.Creator?.type === "rich_text"
      ? properties.Creator.rich_text
          .map((item) => item.plain_text)
          .join("")
      : "";

  const type =
    properties.Type?.type === "select"
      ? properties.Type.select?.name ?? ""
      : "";

  const year =
    properties.Year?.type === "number"
      ? properties.Year.number
      : null;

  const featured =
    properties.Featured?.type === "checkbox"
      ? properties.Featured.checkbox
      : false;

  const sort =
    properties.Sort?.type === "number"
      ? properties.Sort.number
      : null;

  const slug =
    properties.Slug?.type === "rich_text"
      ? properties.Slug.rich_text
          .map((item) => item.plain_text)
          .join("")
      : "";

  console.log();
  console.log({
    title,
    creator,
    type,
    year,
    featured,
    sort,
    slug,
    pageId: page.id,
  });
}