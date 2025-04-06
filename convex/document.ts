import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDocument = query({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.get(args.id);
  },
});

export const getDocumentsFromCollection = query({
  args: {
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    if (args.collectionId.length === 0) return [];

    return ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("collections"), args.collectionId))
      .collect();
  },
});

export const createDocument = mutation({
  args: {
    name: v.string(),
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("documents", {
      name: args.name,
      collections: args.collectionId,
      content: '{"type":"doc","content":[{"type": "paragraph"}]}',
    });
  },
});
