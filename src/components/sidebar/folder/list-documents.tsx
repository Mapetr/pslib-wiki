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
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { Link } from "@tanstack/react-router";
import ButtonAction from "@/components/sidebar/button-action.tsx";

export default function FolderDocumentList({
  id,
  name,
}: {
  id: Id<"folders">;
  name: string;
}) {
  const { data, error } = useQuery(
    convexQuery(api.document.getDocumentsFromFolder, {
      folderId: id,
    }),
  );

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
          {data?.map((document) => (
            <SidebarMenuSubItem key={document._id}>
              <SidebarMenuSubButton asChild>
                <Link
                  to={"/$collectionId/$documentId"}
                  params={{
                    collectionId: document.collections,
                    documentId: document._id,
                  }}
                  preload={"intent"}
                >
                  {document.name}
                </Link>
              </SidebarMenuSubButton>
              <ButtonAction id={document._id} />
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
