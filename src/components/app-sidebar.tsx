import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar.tsx";
import Footer from "@/components/sidebar/footer.tsx";
import { CollectionSwitcher } from "@/components/sidebar/collection-switcher.tsx";
import DocumentList from "@/components/sidebar/document-list.tsx";
import FolderList from "@/components/sidebar/folder/folder-list.tsx";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <CollectionSwitcher />
      </SidebarHeader>
      <SidebarContent className={"gap-0"}>
        <FolderList />
        <DocumentList />
      </SidebarContent>
      <Footer />
      <SidebarRail />
    </Sidebar>
  );
}
