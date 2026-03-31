import { createTool, type ToolCtx } from "@convex-dev/agent";
import type { Tool, ToolExecutionOptions } from "ai";
import z from "zod";
import {
  escalate as escalateConversationMutation,
  updateLastMessage as updateConversationLastMessageMutation,
} from "../../conversations";

const createStringTool = createTool as unknown as (config: {
  description: string;
  args: z.ZodTypeAny;
  handler: (
    ctx: ToolCtx,
    args: unknown,
    options: ToolExecutionOptions,
  ) => Promise<string>;
}) => Tool<any, string>;

export const escalateConversation = createStringTool({
  description: "Escalate a conversation.",
  args: z.object({}),
  handler: async (
    ctx: ToolCtx,
    _args: unknown,
    _options: ToolExecutionOptions,
  ) => {
    if (!ctx.threadId) {
      return "missing thread id";
    }

    await ctx.runMutation(escalateConversationMutation as any, {
      threadId: ctx.threadId,
    });

    await ctx.runMutation(updateConversationLastMessageMutation as any, {
      threadId: ctx.threadId,
      text: "The conversation has been marked as escalated.",
      role: "assistant",
    });

    return "Conversation marked as escalated.";
  },
});
