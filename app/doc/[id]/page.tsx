import Editor from "@/components/Editor";
import { connectionPool, DOCUMENTS_NAME } from "@/lib/surrealdb";
import { Document } from "@/lib/types";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import {
  GetCollectionFromDocument,
  GetDocumentName,
} from "@/app/doc/[id]/actions";
import { SetCollectionFromDocument } from "./collectionSet";
import { Metadata, ResolvingMetadata } from "next";

async function getDocument(id: string) {
  await connection();
  const db = await connectionPool.acquire();
  try {
    return await db.query<[Document[]]>(
      `SELECT *
       FROM ${DOCUMENTS_NAME}:${id};`,
    );
  } finally {
    connectionPool.release(db);
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const row = params.then(async ({ id }) => {
    const [row] = await getDocument(id);
    if (!row) {
      return undefined;
    }
    return row[0];
  });

  return (
    <Suspense>
      <Content document={row} />
    </Suspense>
  );
}

async function Content({
  document,
}: {
  document: Promise<Document | undefined>;
}) {
  const row = await document;
  if (!row) {
    redirect("/");
    return;
  }

  const collectionId = await GetCollectionFromDocument(row.id);

  return (
    <div className={"flex justify-center"}>
      <SetCollectionFromDocument collectionId={collectionId} />
      <Editor content={row.content} id={row.id.toString()} />
    </div>
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = (await params).id;

  const previousImages = (await parent).openGraph?.images || [];
  const prevName = (await parent).title;

  let name = await GetDocumentName(id);
  if (name === "") {
    name = prevName?.absolute ?? "";
  }

  return {
    title: name,
    openGraph: {
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
  };
}
