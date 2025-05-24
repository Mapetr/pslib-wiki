import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexReactClient } from "convex/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { dark } from "@clerk/themes";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import * as Sentry from "@sentry/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

import { routeTree } from "./routeTree.gen";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner.tsx";

// Create a new router instance
const router = createRouter({ routeTree });

Sentry.init({
  dsn: "https://1974cd5a1a4cde5aa90fb476963939d0@o4508695722786816.ingest.de.sentry.io/4509379596255312",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.browserSessionIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.tanstackRouterBrowserTracingIntegration(router),
    Sentry.captureConsoleIntegration({
      levels: ["warn", "error"],
    }),
  ],
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Analytics />
          <Toaster />
        </QueryClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
);
