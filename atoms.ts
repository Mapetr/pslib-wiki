import { atomWithStorage } from "jotai/utils";
import { Doc } from "./convex/_generated/dataModel";

export const activeCollectionAtom = atomWithStorage(
  "collection",
  {} as Doc<"collections">,
);
