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
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Authenticated } from "convex/react";

export default function ButtonAction({
  id,
  folders,
}: {
  id: Id<"documents">;
  folders:
    | {
        _id: Id<"folders">;
        _creationTime: number;
        collection: Id<"collections">;
        name: string;
      }[]
    | undefined;
}) {
  const { mutate: move } = useMutation({
    mutationFn: useConvexMutation(api.document.moveToFolder),
  });

  return (
    <Authenticated>
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
    </Authenticated>
  );
}
