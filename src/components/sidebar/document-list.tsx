import { useAtomValue } from "jotai";
import { activeCollectionAtom } from "../../../atoms.ts";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Link } from "@tanstack/react-router";

export default function DocumentList() {
  const activeCollection = useAtomValue(activeCollectionAtom);

  const { data, isPending, error } = useQuery(
    convexQuery(
      api.document.getDocumentsFromCollection,
      activeCollection._id ?
        {
          collectionId: activeCollection._id,
        }
      : "skip",
    ),
  );

  if (!activeCollection._id) return;

  if (isPending) {
    return <Loader2 className={"animate-spin"} />;
  }

  if (error) {
    console.error(error);

    return <span>Something went wrong. Try refreshing</span>;
  }

  if (!data) return <span>Nothing here</span>;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.map((doc) => (
            <SidebarMenuItem key={doc._id}>
              <SidebarMenuButton
                className={"cursor-pointer"}
                tooltip={doc.name}
                asChild
              >
                <Link
                  to={"/doc/$documentId"}
                  params={{
                    documentId: doc._id,
                  }}
                  preload={"intent"}
                >
                  {doc.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
