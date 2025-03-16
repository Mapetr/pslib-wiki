import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/components/AppSidebar.tsx";
import Header from "@/components/Header.tsx";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Editor } from "@/components/Editor.tsx";

function App() {
  const pathname = window.location.pathname;
  const id = pathname.split("/doc/")[1];

  const { data, isPending, error } = useQuery(
    convexQuery(
      api.document.getDocument,
      id !== "" ? { id: id as Id<"documents"> } : "skip",
    ),
  );
  console.log(data);

  return (
    <div className={"bg-background"}>
      <SidebarProvider>
        <AppSidebar />
        <main className={"flex w-full flex-col"}>
          <Header name={data?.name} />
          <Editor id={"test"} />
        </main>
      </SidebarProvider>
    </div>
  );
}

export default App;
