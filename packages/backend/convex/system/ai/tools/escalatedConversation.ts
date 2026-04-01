import { createTool, type ToolCtx } from "@convex-dev/agent";
import type { Tool, ToolExecutionOptions } from "ai";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

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
  description: "Escalate a conversation",
  args: z.object({}),
  handler: async (
    ctx: ToolCtx,
    _args: unknown,
    _options: ToolExecutionOptions,
  ) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Conversation escalated to a human operator.",
      },
    });

    return "Conversation escalated to a human operator";
  },
});
