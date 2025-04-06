import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar.tsx";
import Footer from "@/components/sidebar/footer.tsx";
import { CollectionSwitcher } from "@/components/sidebar/collection-switcher.tsx";
import DocumentList from "@/components/sidebar/document-list.tsx";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <CollectionSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <DocumentList />
      </SidebarContent>
      <Footer />
      <SidebarRail />
    </Sidebar>
  );
}
