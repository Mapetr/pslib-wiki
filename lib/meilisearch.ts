import { MeiliSearch } from "meilisearch";

export const searchClient = new MeiliSearch({
  host: process.env.MEILI_HOST ?? "http://meilisearch:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
});
export const DocumentsIndex = searchClient.index("documents");
