import Editor from "@/components/Editor";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { connectionPool, DOCUMENTS_NAME } from "@/lib/surrealdb";
import { Document } from "@/lib/types";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { useSetAtom } from "jotai";
import { currentCollectionAtom, selectedCollectionAtom } from "@/atoms";
import { GetCollectionFromDocument } from "@/app/doc/[id]/actions";
import { SetCollectionFromDocument } from "./collectionSet";

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
      <SignedOut>
        <div
          className={
            "prose prose-base prose-invert mx-8 my-4 prose-headings:mb-4 prose-p:mb-2 prose-p:mt-0"
          }
          dangerouslySetInnerHTML={{ __html: row.content }}
        />
      </SignedOut>
      <SignedIn>
        <Editor content={row.content} id={row.id.toString()} />
      </SignedIn>
    </div>
  );
}
