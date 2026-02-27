// import { paginationOptsValidator } from "convex/server";
// import { ConvexError, v } from "convex/values";
// import { action, query } from "../_generated/server";
// import { supportAgent } from "../system/ai/agents/supportAgent";

// export const create = action({
//   args: {
//     prompt: v.string(),
//     threadId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Identity not found",
//       });
//     }

//     const orgId = identity.org_id as string;

//     if (!orgId) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Organization ID not found",
//       });
//     }

//     const conversation = await ctx.runQuery(
//       "system/conversations:getByThreadId" as any,
//       { threadId: args.threadId },
//     );

//     if (!conversation) {
//       throw new ConvexError({
//         code: "NOT_FOUND",
//         message: "Conversation not found",
//       });
//     }

//     if (conversation.organizationId !== orgId) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Not authorized to access this conversation",
//       });
//     }

//     if (conversation.status === "resolved") {
//       throw new ConvexError({
//         code: "BAD_REQUEST",
//         message: "Conversation is resolved",
//       });
//     }

//     await supportAgent.generateText(
//       ctx,
//       { threadId: args.threadId },
//       { prompt: args.prompt },
//     );
//   },
// });

// export const getMany = query({
//   args: {
//     threadId: v.string(),
//     paginationOpts: paginationOptsValidator,
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Identity not found",
//       });
//     }

//     const orgId = identity.org_id as string;

//     if (!orgId) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Organization ID not found",
//       });
//     }

//     const conversation = await ctx.db
//       .query("conversations")
//       .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
//       .first();

//     if (!conversation) {
//       throw new ConvexError({
//         code: "NOT_FOUND",
//         message: "Conversation not found",
//       });
//     }

//     if (conversation.organizationId !== orgId) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Not authorized to access this conversation",
//       });
//     }

//     const paginated = await supportAgent.listMessages(ctx, {
//       threadId: args.threadId,
//       paginationOpts: args.paginationOpts,
//     });

//     return paginated;
//   },
// });
