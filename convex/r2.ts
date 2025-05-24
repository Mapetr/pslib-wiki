import { R2 } from "@convex-dev/r2";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const r2 = new R2(components.r2);

export const { generateUploadUrl, syncMetadata } = r2.clientApi({
  checkUpload: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }
  },
});

export const getUrlFromKey = query({
  args: {
    key: v.string(),
  },
  handler: (_ctx, args) => {
    return `${process.env.DESTINATION_UPLOAD}/${args.key}`;
  },
});
