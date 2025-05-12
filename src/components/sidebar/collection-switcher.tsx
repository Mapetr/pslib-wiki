"use client";

import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { activeCollectionAtom } from "../../../atoms.ts";
import { useAtom } from "jotai";
import { Authenticated } from "convex/react";
import { useNavigate } from "@tanstack/react-router";

export function CollectionSwitcher() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [activeCollection, setActiveCollection] = useAtom(activeCollectionAtom);

  // TODO: load from stale data first
  const collections = useQuery(convexQuery(api.collection.getCollections, {}));

  if (collections.isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>Loading...</SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (collections.error || !collections.data) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>dead</SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeCollection) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="default"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeCollection.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Collections
            </DropdownMenuLabel>
            {collections.data.map((collection, index) => (
              <DropdownMenuItem
                key={collection.name}
                onClick={async () => {
                  setActiveCollection(collection);
                  await navigate({
                    to: "/$collectionId",
                    params: { collectionId: collection._id },
                  });
                }}
                className="gap-2 p-2"
              >
                {collection.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <Authenticated>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add collection
                </div>
              </DropdownMenuItem>
            </Authenticated>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
