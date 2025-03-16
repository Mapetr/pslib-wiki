import { defineApp } from "convex/server";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import prosemirrorSync from "@convex-dev/prosemirror-sync/convex.config";

const app = defineApp();
app.use(prosemirrorSync);

export default app;
