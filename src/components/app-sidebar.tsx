import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar.tsx";
import Footer from "@/components/sidebar/footer.tsx";
import { CollectionSwitcher } from "@/components/sidebar/collection-switcher.tsx";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <CollectionSwitcher />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <Footer />
    </Sidebar>
  );
}
