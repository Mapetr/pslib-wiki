import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { dark } from "@clerk/themes";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { Suspense } from "react";
import { CSPostHogProvider, JotaiProvider } from "@/app/providers";
import { WebVitals } from "@/app/web-vitals";
import { Command } from "@/components/Command";
import SearchButton from "@/components/SearchButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wiki.pslib.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // TODO: Temp fix i dunno whats actually broken
    <Suspense>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <html lang="en">
          <CSPostHogProvider>
            <JotaiProvider>
              <body
                className={`${geistSans.variable} ${geistMono.variable} dark bg-background antialiased`}
              >
                <Command />
                <WebVitals />
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                    <SidebarTrigger
                      className={"ml-4 mt-2 md:absolute md:left-4 md:top-4"}
                    />
                    <SearchButton />
                    {children}
                  </SidebarInset>
                </SidebarProvider>
              </body>
            </JotaiProvider>
          </CSPostHogProvider>
        </html>
      </ClerkProvider>
    </Suspense>
  );
}
