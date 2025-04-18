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

export default function AddFolderButton() {
  return (
    <SidebarMenuItem>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarMenuButton
            className={"flex cursor-pointer items-center justify-between"}
          >
            <span>Add folder</span>
            <Plus />
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent>
          <FolderDialog />
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
}
