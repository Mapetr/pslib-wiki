import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createFolder = mutation({
  args: {
    name: v.string(),
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("folders", {
      name: args.name,
      collection: args.collectionId,
    });
  },
});
