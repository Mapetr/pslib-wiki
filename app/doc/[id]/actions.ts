"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";
import { uuidv4 } from "lib0/random";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { connectionPool, DOCUMENTS_NAME } from "@/lib/surrealdb";
import { RecordId } from "surrealdb";
import { Document } from "@/lib/types";

const s3Client = new S3Client({
  region: process.env.S3_REGION ?? "",
  endpoint: process.env.S3_ENDPOINT ?? "",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "",
  },
});

export async function uploadFileToS3(size: number, type: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { message: "You must be signed in", url: "" };
    }

    if (size > 25000000)
      return {
        message: "File too big",
        url: "",
      };

    if (!["image/png", "image/jpeg", "image/gif", "image/webp"].includes(type))
      return {
        message: "Incorrect MIME-type",
        url: "",
      };

    const key = `uploads/${Date.now()}-${uuidv4()}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentLength: size,
      ContentType: type,
    });

    return {
      message: "uploading",
      url: await getSignedUrl(s3Client, command, { expiresIn: 900 }),
    };
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

interface CollectionResult {
  collections: RecordId[];
}

export async function GetCollectionFromDocument(
  documentId: string,
): Promise<string> {
  if (!documentId) return "";

  const db = await connectionPool.acquire();
  try {
    // language=SQL format=false
    return await db
      .query<[CollectionResult[], CollectionResult[]]>(
        `SELECT <-collections AS collections
                                                          FROM contains
                                                          WHERE out = ${documentId};
    SELECT <-folders<-contains<-collections AS collections
    FROM folderContains
    WHERE out = ${documentId};`,
      )
      .then((result) => {
        if (!result) return "";

        if (result[0][0]) {
          const first = result[0][0].collections[0];
          if (first) return first.toString();
        }

        if (result[1][0]) {
          const secord = result[1][0].collections[0];
          if (secord) return secord.toString();
        }

        return "";
      });
  } finally {
    connectionPool.release(db);
  }
}

export async function GetDocumentName(id: string): Promise<string> {
  const db = await connectionPool.acquire();

  try {
    return await db
      .query<[Document[]]>(`SELECT name FROM ${DOCUMENTS_NAME}:${id}`)
      .then(([result]) => {
        return result[0].name ?? "";
      });
  } finally {
    connectionPool.release(db);
  }
}
