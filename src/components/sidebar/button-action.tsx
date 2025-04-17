import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { SidebarMenuAction } from "@/components/ui/sidebar.tsx";
import { MoreHorizontal } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { useAtomValue } from "jotai";
import { activeCollectionAtom } from "../../../atoms.ts";

export default function ButtonAction({ id }: { id: Id<"documents"> }) {
  const activeCollection = useAtomValue(activeCollectionAtom);

  const { data: folders } = useQuery(
    convexQuery(api.folder.getFoldersFromCollection, {
      collectionId: activeCollection._id ?? "",
    }),
  );

  const { mutate: move } = useMutation({
    mutationFn: useConvexMutation(api.document.moveToFolder),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction className={"cursor-pointer"}>
          <MoreHorizontal />
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"start"}>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to folder</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {folders?.map((folder) => (
                <DropdownMenuItem
                  key={folder._id}
                  onClick={() => {
                    move({
                      docId: id,
                      folderId: folder._id,
                    });
                  }}
                >
                  {folder.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => {
                  move({
                    docId: id,
                    folderId: undefined,
                  });
                }}
              >
                Unassign
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
