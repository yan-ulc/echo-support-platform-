import { action, query } from "../_generated/server";
import { internal } from "../_generated/api";
import { ConvexError, v } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { threadId } from "worker_threads";
import { paginationOptsValidator } from "convex/server";
import { constants } from "buffer";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },

  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      { contactSessionId: args.contactSessionId }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session is invalid or expired",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: args.threadId }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session or thread ID",
      });
    }

    if (conversation.contactSessionId !== args.contactSessionId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found for this contact session",
      });
    }

if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation Resolved",
      });
    }

    // TODO: implement subscription check
    await supportAgent.generateText(
        ctx, 
        {threadId: args.threadId},
        {prompt: args.prompt}
         
    )
},
});

export const getMany = query({ 
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
        contactSessionId: v.id("contactSessions"),
    },
    handler : async (ctx, args) => {
        const contactSession = await ctx.db.get(args.contactSessionId);
    
        if (!contactSession || contactSession.expiresAt < Date.now()) {
          throw new ConvexError({
            code: "UNAUTHORIZED",
            message: "Contact session is invalid or expired",
          });
        }

        const paginated = await supportAgent.listMessages(
            ctx,
            {threadId: args.threadId,
            paginationOpts: args.paginationOpts
            },
        );
        return paginated;
    }
});
