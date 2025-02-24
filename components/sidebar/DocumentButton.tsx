"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import DocumentActionButton from "@/components/sidebar/DocumentActionButton";
import { usePathname } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import SidebarContextMenu from "@/components/sidebar/SidebarContextMenu";

export default function DocumentButton({
  item,
  folders,
  submenu = false,
}: {
  item: { id: string; name: string };
  folders: { id: string; name: string }[];
  submenu: boolean;
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const linkId = item.id.split(":")[1];

  if (submenu) {
    return (
      <SidebarMenuSubItem className={"relative"}>
        <SidebarMenuSubButton
          asChild
          isActive={pathname.split("/").pop() === linkId}
        >
          <Link href={`/doc/${linkId}`} onClick={() => setOpenMobile(false)}>
            {item.name}
          </Link>
        </SidebarMenuSubButton>
        <SignedIn>
          <DocumentActionButton item={item} folders={folders} key={item.id} />
        </SignedIn>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem>
      <ContextMenu>
        <ContextMenuTrigger>
          <SidebarMenuButton
            asChild
            isActive={pathname.split("/").pop() === linkId}
          >
            <Link href={`/doc/${linkId}`} onClick={() => setOpenMobile(false)}>
              {item.name}
            </Link>
          </SidebarMenuButton>
        </ContextMenuTrigger>
        <SidebarContextMenu item={item} folders={folders} />
      </ContextMenu>
      {/*<SignedIn>*/}
      {/*  <DocumentActionButton item={item} folders={folders} key={item.id} />*/}
      {/*</SignedIn>*/}
    </SidebarMenuItem>
  );
}
