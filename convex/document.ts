import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDocument = query({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
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
      .filter((q) =>
        q.and(
          q.eq(q.field("collections"), args.collectionId),
          q.eq(q.field("folders"), undefined),
        ),
      )
      .collect();
  },
});

export const moveToFolder = mutation({
  args: {
    docId: v.id("documents"),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    return ctx.db.patch(args.docId, {
      folders: args.folderId,
    });
  },
});

export const getDocumentsFromFolder = query({
  args: {
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    if (args.folderId.length === 0) return [];

    return ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("folders"), args.folderId))
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

export const updateDocumentName = mutation({
  args: {
    id: v.id("documents"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.patch(args.id, {
      name: args.newName,
    });
  },
});

export const deleteDocument = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    await ctx.db.delete(args.id);
  },
});
