import { createFileRoute } from "@tanstack/react-router";
import { Editor } from "@/components/editor.tsx";
import { useSetAtom } from "jotai";
import { activeCollectionAtom } from "../../../atoms.ts";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";

export const Route = createFileRoute("/$collectionId/$documentId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { documentId, collectionId } = Route.useParams();
  const setCollection = useSetAtom(activeCollectionAtom);

  const collection = useQuery(
    convexQuery(api.collection.getCollectionFromId, {
      collectionId: collectionId as Id<"collections">,
    }),
  );

  if (!collection.isError && collection.data) {
    setCollection(collection.data);
  }

  return <Editor key={documentId} id={documentId} />;
}
