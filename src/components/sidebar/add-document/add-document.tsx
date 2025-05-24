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
import { useState } from "react";

export default function AddDocumentButton() {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <SidebarMenuButton
            className={"flex cursor-pointer items-center justify-between"}
          >
            <span>Add document</span>
            <Plus />
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent>
          <DocumentDialog setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
}
