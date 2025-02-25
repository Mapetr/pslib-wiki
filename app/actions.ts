"use server";

import { auth } from "@clerk/nextjs/server";
import {
  connectionPool,
  CONTAINS_NAME,
  DOCUMENTS_NAME,
  FOLDERS_NAME,
} from "@/lib/surrealdb";
import { Document, Folder } from "@/lib/types";
import { stringToRecordId } from "@/lib/utils";
import { DocumentsIndex } from "@/lib/meilisearch";
import sanitizeHtml from "sanitize-html";

export async function createDocument(
  collectionId: string,
  name: string,
): Promise<Document> {
  const { userId } = await auth();

  if (!userId) {
    return {} as unknown as Document;
  }

  const db = await connectionPool.acquire();
  try {
    const [result] = await db.query<[Document[]]>(
      `
    CREATE ${DOCUMENTS_NAME} CONTENT {
      name: $name,
      content: "<p></p>",
    };
    `,
      { name: name },
    );
    await db.relate(
      stringToRecordId(collectionId),
      CONTAINS_NAME,
      result[0].id,
    );
    await DocumentsIndex.addDocuments([
      {
        id: result[0].id.toString().split(":")[1],
        name: name,
        content: "",
      },
    ]);
    return {
      id: result[0].id.toString(),
      name: result[0].name,
      content: result[0].content,
      createdAt: result[0].createdAt,
    };
  } finally {
    connectionPool.release(db);
  }
}

export async function createFolder(collectionId: string, name: string) {
  const { userId } = await auth();

  if (!userId) {
    return {} as unknown as Folder;
  }

  const db = await connectionPool.acquire();
  try {
    const [result] = await db.query<[Folder[]]>(
      `CREATE ${FOLDERS_NAME} SET name = $name`,
      { name: name },
    );
    await db.relate(
      stringToRecordId(collectionId),
      CONTAINS_NAME,
      result[0].id,
    );
    return {
      ...result[0],
      id: result[0].id.toString(),
    };
  } finally {
    connectionPool.release(db);
  }
}

export async function saveDocument(id: string, content: string) {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const db = await connectionPool.acquire();
  try {
    await db.query(
      `UPDATE ${id}
       SET content = $content,
           content_embedding = $embedding`,
      {
        content: sanitizeHtml(content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
      },
    );
    await DocumentsIndex.updateDocuments([
      {
        id: id.split(":")[1],
        content: sanitizeHtml(content, {
          allowedTags: [],
          allowedAttributes: {},
        }),
      },
    ]);
    return true;
  } finally {
    connectionPool.release(db);
  }
}

export interface SearchResult {
  id: string;
  name: string;
}

export async function searchDocument(search: string) {
  if (!search) return [];
  const result = await DocumentsIndex.search(search, {
    attributesToRetrieve: ["id", "name"],
    limit: 5,
  });
  return result.hits as SearchResult[];
}
