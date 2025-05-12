import { useAtomValue } from "jotai/index";
import { activeCollectionAtom } from "../../../../atoms.ts";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import FolderDocumentList from "@/components/sidebar/folder/list-documents.tsx";

export default function FolderList() {
  const activeCollection = useAtomValue(activeCollectionAtom);

  const { data, error } = useQuery(
    convexQuery(
      api.folder.getFoldersFromCollection,
      activeCollection._id ?
        {
          collectionId: activeCollection._id,
        }
      : "skip",
    ),
  );

  if (!activeCollection._id) return;

  if (error) {
    console.error(error);

    // return <span>Something went wrong. Try refreshing</span>;
    return;
  }

  if (!data) return;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.map((folder) => (
            <SidebarMenuItem key={folder._id}>
              <FolderDocumentList id={folder._id} name={folder.name} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
