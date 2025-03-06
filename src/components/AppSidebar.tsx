import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar.tsx";
import Footer from "@/components/sidebar/Footer.tsx";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent></SidebarContent>
      <Footer />
    </Sidebar>
  );
}
