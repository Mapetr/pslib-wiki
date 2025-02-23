"use client";

import { useSetAtom } from "jotai/index";
import { selectedCollectionAtom } from "@/atoms";
import { useEffect } from "react";

export function SetCollectionFromDocument({
  collectionId,
}: {
  collectionId: string;
}) {
  const setSelectedCollection = useSetAtom(selectedCollectionAtom);

  useEffect(() => {
    setSelectedCollection(collectionId);
  }, [collectionId, setSelectedCollection]);

  return null;
}
