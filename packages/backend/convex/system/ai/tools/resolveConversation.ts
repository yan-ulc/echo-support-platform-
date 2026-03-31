import { createTool, type ToolCtx } from "@convex-dev/agent";
import type { Tool, ToolExecutionOptions } from "ai";
import z from "zod";
import {
  resolve as resolveConversationMutation,
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

export const resolveConversation = createStringTool({
  description: "Resolve a conversation.",
  args: z.object({}),
  handler: async (ctx: ToolCtx, _args: unknown, _options: ToolExecutionOptions) => {
    if (!ctx.threadId) {
      return "missing thread id";
    }

    await ctx.runMutation(resolveConversationMutation as any, {
      threadId: ctx.threadId,
    });

    await ctx.runMutation(updateConversationLastMessageMutation as any, {
      threadId: ctx.threadId,
      text: "The conversation has been marked as resolved.",
      role: "assistant",
    });

    return "Conversation marked as resolved.";
  },
});
