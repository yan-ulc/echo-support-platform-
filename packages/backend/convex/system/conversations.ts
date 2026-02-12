import { hasDefaultResponseFormat } from "@ai-sdk/openai/internal";
import { internalQuery } from "../_generated/server";
import { v } from "convex/values";

export const getByThreadId = internalQuery ({
    args: {
        threadId: v.string(),
    },
    handler: async (ctx, args) => {
        const conversation = await ctx.db
        .query("conversations")
        .withIndex("by_thread_id", (q) =>
            q.eq("threadId", args.threadId)
        ).unique()
        return conversation;
    }
});
