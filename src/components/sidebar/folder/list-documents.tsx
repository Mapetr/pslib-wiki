import { Id } from "../../../../convex/_generated/dataModel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import {
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx";
import { ChevronRight } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { Link } from "@tanstack/react-router";
import ButtonAction from "@/components/sidebar/button-action.tsx";
import { useAtomValue } from "jotai/index";
import { activeCollectionAtom } from "../../../../atoms.ts";
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

export default function FolderDocumentList({
  id,
  name,
}: {
  id: Id<"folders">;
  name: string;
}) {
  const activeCollection = useAtomValue(activeCollectionAtom);

  const { data, error } = useQuery(
    convexQuery(api.document.getDocumentsFromFolder, {
      folderId: id,
    }),
  );

  const { data: folders } = useQuery(
    convexQuery(api.folder.getFoldersFromCollection, {
      collectionId: activeCollection._id ?? "skip",
    }),
  );

  const { mutate: move } = useMutation({
    mutationFn: useConvexMutation(api.document.moveToFolder),
  });

  if (error) {
    if (error) console.error(error);

    return <span>Something went wrong. Try refreshing</span>;
  }

  return (
    <Collapsible key={id} className={"group/collapsible"}>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton tooltip={name} className={"cursor-pointer"}>
          <span>{name}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {data?.map((doc) => (
            <SidebarMenuSubItem key={doc._id}>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <SidebarMenuSubButton asChild>
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
                  </SidebarMenuSubButton>
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
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
