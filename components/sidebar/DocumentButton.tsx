"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
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
      <SidebarMenuSubItem>
        <ContextMenu>
          <ContextMenuTrigger>
            <SidebarMenuSubButton
              asChild
              isActive={pathname.split("/").pop() === linkId}
            >
              <Link
                href={`/doc/${linkId}`}
                onClick={() => setOpenMobile(false)}
              >
                {item.name}
              </Link>
            </SidebarMenuSubButton>
          </ContextMenuTrigger>
          <SidebarContextMenu item={item} folders={folders} />
        </ContextMenu>
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
    </SidebarMenuItem>
  );
}
