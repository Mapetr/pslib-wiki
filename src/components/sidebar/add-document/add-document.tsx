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
import DocumentDialog from "@/components/sidebar/add-document/document-dialog.tsx";

export default function AddDocumentButton() {
  return (
    <SidebarMenuItem>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarMenuButton
            className={"flex cursor-pointer items-center justify-between"}
          >
            <span>Add document</span>
            <Plus />
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent>
          <DocumentDialog />
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
}
