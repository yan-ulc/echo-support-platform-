import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { ConvexError } from "convex/values";

export const getByThreadId = internalQuery({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();
    return conversation;
  },
});


export const resolve = internalMutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => { 
    const covnersation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique(); 
    if (!covnersation) {
      throw new ConvexError("Conversation not found");
    }
    await ctx.db.patch(covnersation._id, { status: "resolved" });
  }})

  export const escalate = internalMutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => { 
    const covnersation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique(); 
    if (!covnersation) {
      throw new ConvexError("Conversation not found");
    }
    await ctx.db.patch(covnersation._id, { status: "escalated" });
  }})