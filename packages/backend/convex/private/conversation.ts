import { MessageDoc } from "@convex-dev/agent";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { supportAgent } from "../system/ai/agents/supportAgent";

export const getMany = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(
      v.union(
        v.literal("unresolved"),
        v.literal("escalated"),
        v.literal("resolved"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    console.log("Identity keys:", Object.keys(identity));

    const orgId = identity.org_id as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization ID not found",
      });
    }
    let conversations: PaginationResult<Doc<"conversations">>;

    if (args.status) {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_status_and_organization_Id", (q) =>
          q
            .eq("status", args.status as Doc<"conversations">["status"])
            .eq("organizationId", orgId),
        )
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
        .order("desc")
        .paginate(args.paginationOpts);
    }
    const conversationsWithAdditionalData = await Promise.all(
      conversations.page.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;

        const contactSession = await ctx.db.get(conversation.contactSessionId);

        if (!contactSession) {
          return null;
        }

        const message = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: { numItems: 1, cursor: null },
        });
        if (message.page.length > 0) {
          lastMessage = message.page[0] ?? null;
        }
        return {
          ...conversation,
          lastMessage,
          contactSession,
        };
      }),
    );

    const validatedConversations = conversationsWithAdditionalData.filter(
      (conv): conv is NonNullable<typeof conv> => conv !== null,
    );

    console.log("Total conversations from DB:", conversations.page.length);
    console.log("Validated conversations:", validatedConversations.length);
    console.log("Sample conversation:", validatedConversations[0]);

    return {
      ...conversations,
      page: validatedConversations,
    };
  },
});
