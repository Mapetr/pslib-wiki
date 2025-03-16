import { query } from "./_generated/server";
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
