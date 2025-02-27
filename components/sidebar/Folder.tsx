"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import DocumentButton from "@/components/sidebar/DocumentButton";
import { FolderDocuments } from "@/lib/types";
import { usePathname } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DeleteFolder, UpdateFolderName } from "@/components/sidebar/actions";
import { useSetAtom } from "jotai";
import { currentCollectionAtom } from "@/atoms";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Folder({
  folder,
  folderNames,
}: {
  folder: FolderDocuments;
  folderNames: { id: string; name: string }[];
}) {
  const [name, setName] = useState("");
  const pathname = usePathname();
  const setCurrentCollection = useSetAtom(currentCollectionAtom);

  const linkIds: Set<string> = new Set();

  folder.documents.map((document) => {
    linkIds.add(document.id.toString().split(":").pop() ?? "");
  });

  return (
    <ContextMenu>
      <Collapsible
        className={"group/collapsible"}
        defaultOpen={linkIds.has(pathname.split("/").pop() ?? "")}
        asChild
      >
        <SidebarMenuItem>
          <ContextMenuTrigger asChild>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={folder.name}>
                <span>{folder.name}</span>
                <ChevronDown
                  className={
                    "ml-auto -rotate-90 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-0"
                  }
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </ContextMenuTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {folder.documents.map((document) => (
                <DocumentButton
                  key={document.id}
                  item={document}
                  folders={folderNames}
                  submenu={true}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
      <AlertDialog>
        <Dialog>
          <ContextMenuContent>
            <DialogTrigger asChild>
              <ContextMenuItem>Edit name</ContextMenuItem>
            </DialogTrigger>
            <AlertDialogTrigger asChild>
              <ContextMenuItem>Delete</ContextMenuItem>
            </AlertDialogTrigger>
          </ContextMenuContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit name</DialogTitle>
              <DialogDescription>Edit the name of a document</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue={folder.name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="submit"
                  onClick={async () => {
                    if (name === "") return;
                    await UpdateFolderName(folder.id, name);

                    setCurrentCollection((prevState) => {
                      const folderIndex = prevState.folders.findIndex(
                        (x) => x.id === folder.id,
                      );
                      if (folderIndex === -1) return prevState;

                      prevState.folders[folderIndex].name = name;

                      return {
                        ...prevState,
                      };
                    });
                  }}
                >
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Do you really want to delete {folder.name}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the
                document.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await DeleteFolder(folder.id);

                  setCurrentCollection((prevState) => {
                    const folderIndex = prevState.folders.findIndex(
                      (x) => x.id === folder.id,
                    );
                    if (folderIndex === -1) return prevState;

                    const oldFolder = prevState.folders.splice(folderIndex, 1);

                    return {
                      ...prevState,
                      documents: [
                        ...prevState.documents,
                        ...oldFolder[0].documents,
                      ],
                    };
                  });
                }}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </Dialog>
      </AlertDialog>
    </ContextMenu>
  );
}
