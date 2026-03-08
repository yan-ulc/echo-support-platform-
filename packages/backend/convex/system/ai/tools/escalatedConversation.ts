import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";

export const escalateConversation = createTool({
  description: "Escalate a conversation",
  args: z.any(),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });

    // The agent framework automatically saves tool results as messages
    return "Conversation escalated to a human operator";
  },
});
