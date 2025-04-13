import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar.tsx";
import Header from "@/components/header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
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
