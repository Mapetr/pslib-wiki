import { useAtomValue } from "jotai";
import { activeCollectionAtom } from "../../../atoms.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import ButtonAction from "@/components/sidebar/button-action.tsx";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";
import { useConvexMutation } from "@convex-dev/react-query";

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

  const { data: folders } = useQuery(
    convexQuery(api.folder.getFoldersFromCollection, {
      collectionId: activeCollection._id ?? "skip",
    }),
  );

  const { mutate: move } = useMutation({
    mutationFn: useConvexMutation(api.document.moveToFolder),
  });

  if (!activeCollection._id) return;

  if (isPending) {
    return <Loader2 className={"animate-spin"} />;
  }

  if (error) {
    console.error(error);

    // return <span>Something went wrong. Try refreshing</span>;
    return;
  }

  if (!data || data.length === 0) return;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.map((doc) => (
            <SidebarMenuItem key={doc._id}>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <SidebarMenuButton
                    className={"cursor-pointer"}
                    tooltip={doc.name}
                    asChild
                  >
                    <Link
                      to={"/$collectionId/$documentId"}
                      params={{
                        collectionId: doc.collections,
                        documentId: doc._id,
                      }}
                      preload={"intent"}
                    >
                      {doc.name}
                    </Link>
                  </SidebarMenuButton>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>
                      Move to folder
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      {folders?.map((folder) => (
                        <ContextMenuItem
                          key={folder._id}
                          onClick={() => {
                            move({
                              docId: doc._id,
                              folderId: folder._id,
                            });
                          }}
                        >
                          {folder.name}
                        </ContextMenuItem>
                      ))}
                      <ContextMenuItem
                        onClick={() => {
                          move({
                            docId: doc._id,
                            folderId: undefined,
                          });
                        }}
                      >
                        Unassign
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                </ContextMenuContent>
              </ContextMenu>
              <ButtonAction id={doc._id} folders={folders} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
