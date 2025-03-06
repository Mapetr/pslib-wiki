import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/components/AppSidebar.tsx";
import Header from "@/components/Header.tsx";

function App() {
  return (
    <div className={"bg-background"}>
      <SidebarProvider>
        <AppSidebar />
        <main className={"flex w-full flex-col"}>
          <Header />
        </main>
      </SidebarProvider>
    </div>
  );
}

export default App;
