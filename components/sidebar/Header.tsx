"use client";

import { SidebarMenu, SidebarMenuButton } from "../ui/sidebar";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { collectionsAtom, selectedCollectionAtom } from "@/atoms";
import { NewCollection } from "@/components/sidebar/actions";
import { useState } from "react";
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
import { SignedIn } from "@clerk/nextjs";

export default function Header() {
  const [currentCollection, setCurrentCollection] = useAtom(
    selectedCollectionAtom,
  );
  const collections = useAtomValue(collectionsAtom);
  const currentCollectionName =
    collections.find((el) => el.id.toString() === currentCollection)?.name ??
    "Select collection";
  const [newCollName, setNewCollName] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                {currentCollectionName}
                <ChevronDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              {collections.map((collection) => (
                <DropdownMenuItem
                  key={collection.id.toString()}
                  onClick={() => {
                    setOpen(false);
                    setCurrentCollection(collection.id.toString());
                  }}
                >
                  <span>{collection.name}</span>
                </DropdownMenuItem>
              ))}
              <SignedIn>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <span>Add collection</span>
                  </DropdownMenuItem>
                </DialogTrigger>
              </SignedIn>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add collection</DialogTitle>
              <DialogDescription>Add new collection</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  onChange={(e) => setNewCollName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="submit"
                  onClick={async () => {
                    const collection = await NewCollection(newCollName);
                    if (!collection) return;
                    setCurrentCollection(collection.id);
                  }}
                >
                  Create
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
