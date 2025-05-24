import * as React from "react";
import { useEffect, useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar.tsx";
import Header from "@/components/header";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [currentVersion, setCurrentVersion] = useState("");

  const { data } = useQuery(convexQuery(api.updateVersion.getVersion, {}));

  useEffect(() => {
    if (!data) return;

    if (currentVersion === "") {
      setCurrentVersion(data.version);
      return;
    }

    if (data.version === currentVersion) return;

    toast("A new version released", {
      description: "Refresh to update",
      action: {
        label: "Refresh",
        onClick: () => window.location.reload(),
      },
      dismissible: false,
      duration: Infinity,
    });
  }, [currentVersion, data]);

  return (
    <React.Fragment>
      <div className={"bg-background"}>
        <SidebarProvider>
          <AppSidebar />
          <main className={"flex min-h-screen w-full flex-col"}>
            <Header />
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </React.Fragment>
  );
}
