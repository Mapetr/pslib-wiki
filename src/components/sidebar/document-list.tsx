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
                onClick={() =>
                  window.history.pushState({}, "", `/doc/${doc._id}`)
                }
              >
                <span>{doc.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
