import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateVersion = mutation({
  args: {
    hash: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.token !== process.env.VERSION_TOKEN) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("update", { version: args.hash });
  },
});

export const getVersion = query({
  handler: async (ctx) => {
    return await ctx.db.query("update").order("desc").first();
  },
});
