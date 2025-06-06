import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCollection = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("collections", { name: args.name });
  },
});

export const getCollections = query({
  handler: async (ctx) => {
    return await ctx.db.query("collections").collect();
  },
});

export const getCollectionFromId = query({
  args: {
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collections")
      .filter((q) => q.eq(q.field("_id"), args.collectionId))
      .first();
  },
});
