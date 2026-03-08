import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";

export const resolveConversation = createTool({
  description: "Resolve a conversation",
  args: z.any(),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    await ctx.runMutation(internal.system.conversations.resolve, {
      threadId: ctx.threadId,
    });

    // The agent framework automatically saves tool results as messages
    return "Conversation resolved";
  },
});
