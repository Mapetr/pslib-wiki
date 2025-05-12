import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  collections: defineTable({
    name: v.string(),
  }),
  folders: defineTable({
    name: v.string(),
    collection: v.id("collections"),
  }),
  documents: defineTable({
    name: v.string(),
    content: v.string(),
    collections: v.id("collections"),
    folders: v.optional(v.id("folders")),
  }),
});
