import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Plus } from "lucide-react";
import FolderDialog from "@/components/sidebar/add-folder/folder-dialog.tsx";
import { useState } from "react";

export default function AddFolderButton() {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <SidebarMenuButton
            className={"flex cursor-pointer items-center justify-between"}
          >
            <span>Add folder</span>
            <Plus />
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent>
          <FolderDialog setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
}
