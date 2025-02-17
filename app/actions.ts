"use server";

import { auth } from "@clerk/nextjs/server";
import {
  connectionPool,
  CONTAINS_NAME,
  DOCUMENTS_NAME,
  FOLDERS_NAME,
} from "@/lib/surrealdb";
import { Document, Folder } from "@/lib/types";
import { revalidateTag } from "next/cache";
import { stringToRecordId } from "@/lib/utils";
import { Decimal } from "surrealdb";

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
    const embeddings: number[] = await fetch(
      "http://localhost:11434/api/embeddings",
      {
        method: "POST",
        body: JSON.stringify({
          model: "nomic-embed-text",
          prompt: name,
        }),
      },
    ).then(async (result) => {
      const json = await result.json();
      return json.embedding;
    });

    const [result] = await db.query<[Document[]]>(
      `
    CREATE ${DOCUMENTS_NAME} CONTENT {
      name: $name,
      name_embedding: $embedding,
      content: "<p></p>",
      content_embedding: []
    };
    `,
      { name: name, embedding: embeddings },
    );
    await db.relate(
      stringToRecordId(collectionId),
      CONTAINS_NAME,
      result[0].id,
    );
    return {
      id: result[0].id.toString(),
      name: result[0].name,
      name_embedding: [],
      content: result[0].content,
      content_embedding: [],
      createdAt: result[0].createdAt,
    };
  } finally {
    connectionPool.release(db);
  }
}

export async function createFolder(collectionId: string, name: string) {
  const { userId } = await auth();

  if (!userId) {
    return "";
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
    revalidateTag("documents");
    return result[0].id.toString();
  } finally {
    connectionPool.release(db);
  }
}

export async function saveDocument(id: string, content: string) {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const embeddings: number[] = await fetch(
    "http://localhost:11434/api/embeddings",
    {
      method: "POST",
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: content,
      }),
    },
  ).then(async (result) => {
    const json = await result.json();
    return json.embedding;
  });

  const db = await connectionPool.acquire();
  try {
    await db.query(
      `UPDATE ${id}
       SET content = $content,
           content_embedding = $embedding`,
      {
        content: content,
        embedding: embeddings,
      },
    );
    return true;
  } finally {
    connectionPool.release(db);
  }
}

export interface SearchResult extends Document {
  similarity: number;
}

export async function searchDocument(search: string) {
  if (!search) return [];

  const embeddings: number[] = await fetch(
    "http://localhost:11434/api/embeddings",
    {
      method: "POST",
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: search,
      }),
    },
  ).then(async (result) => {
    const json = await result.json();
    return json.embedding;
  });

  const db = await connectionPool.acquire();
  try {
    const results = await db.query<[SearchResult[]]>(
      `SELECT id, name, vector::similarity::cosine(content_embedding,$embedding) AS similarity FROM ${DOCUMENTS_NAME} WHERE content_embedding <|3|> $embedding ORDER BY similarity DESC;`,
      {
        embedding: embeddings,
      },
    );
    return results[0].map((result) => {
      return {
        ...result,
        id: result.id.toString(),
        similarity: Number(result.similarity),
      };
    });
  } finally {
    connectionPool.release(db);
  }
}
