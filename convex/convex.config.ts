import { defineApp } from "convex/server";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import prosemirrorSync from "@convex-dev/prosemirror-sync/convex.config";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import r2 from "@convex-dev/r2/convex.config";

const app = defineApp();
app.use(prosemirrorSync);
app.use(r2);

export default app;
