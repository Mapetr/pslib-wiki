import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/components/app-sidebar.tsx";
import Header from "@/components/header.tsx";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Editor } from "@/components/editor.tsx";
import { Loader2 } from "lucide-react";

function App() {
  const pathname = window.location.pathname;
  const id = pathname.split("/doc/")[1];

  const { data, isPending, error } = useQuery(
    convexQuery(
      api.document.getDocument,
      id ? { id: id as Id<"documents"> } : "skip",
    ),
  );

  if (error) {
    console.error(error);
  }

  return (
    <div className={"bg-background"}>
      <SidebarProvider>
        <AppSidebar />
        <main className={"flex w-full flex-col"}>
          <Header name={data?.name} />
          {id ?
            <Editor id={id} />
          : isPending ?
            <Loader2 className={"animate-spin"} />
          : <></>}
        </main>
      </SidebarProvider>
    </div>
  );
}

export default App;
