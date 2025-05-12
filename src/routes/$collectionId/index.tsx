import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useSetAtom } from "jotai";
import { activeCollectionAtom } from "../../../atoms.ts";

export const Route = createFileRoute("/$collectionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { collectionId } = Route.useParams();
  const setCollection = useSetAtom(activeCollectionAtom);

  const collection = useQuery(
    convexQuery(api.collection.getCollectionFromId, {
      collectionId: collectionId as Id<"collections">,
    }),
  );

  if (!collection.isError && collection.data) {
    setCollection(collection.data);
  }

  return <></>;
}
