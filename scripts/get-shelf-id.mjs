import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_SHELF_DATABASE_ID;

if (!databaseId) {
  throw new Error("NOTION_SHELF_DATABASE_ID is missing");
}

const database = await notion.databases.retrieve({
  database_id: databaseId,
});

console.log("Database:", database.title?.[0]?.plain_text ?? "Shelf");

console.log("\nData sources:");

for (const source of database.data_sources ?? []) {
  console.log(`- ${source.name}: ${source.id}`);
}