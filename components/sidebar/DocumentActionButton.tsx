"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { MoreHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DeleteDocument,
  MoveDocument,
  MoveToCollection,
  UpdateDocumentName,
} from "@/components/sidebar/actions";
import { collectionsAtom } from "@/atoms";

export default function DocumentActionButton({
  item,
  folders,
}: {
  item: { id: string; name: string };
  folders: { id: string; name: string }[];
}) {
  const [name, setName] = useState("");
  const router = useRouter();
  const collections = useAtomValue(collectionsAtom);

  return (
    <Dialog>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction className="right-3 top-1">
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <span>Edit Name</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <span>Delete Document</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Move to Folder</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {folders.map((folder) => (
                    <DropdownMenuItem
                      key={folder.id}
                      onClick={async () => {
                        await MoveDocument(item.id, folder.id);
                        router.refresh();
                      }}
                    >
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    key="unassign-folder"
                    onClick={async () => {
                      await MoveDocument(item.id, null);
                      router.refresh();
                    }}
                  >
                    Unassign
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Move to Collection
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {collections.map((collection) => (
                    <DropdownMenuItem
                      key={collection.id}
                      onClick={() => {
                        MoveToCollection(item.id, collection.id);
                      }}
                    >
                      {collection.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    key="unassign-collection"
                    onClick={() => {
                      MoveToCollection(item.id, null);
                    }}
                  >
                    Unassign
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="sm:max-w-[425px]">
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
                defaultValue={item.name}
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
                  await UpdateDocumentName(item.id, name);
                  router.refresh();
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
              Do you really want to delete {item.name}?
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
                await DeleteDocument(item.id);
                router.refresh();
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
