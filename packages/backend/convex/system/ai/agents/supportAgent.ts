import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "Support Agent",
  chat: groq.languageModel("llama-3.3-70b-versatile") as any,
  instructions: `You are a costumer support agent. use "resolveConversation" tool when user express finalization of the conversation. use "escalateConversation" tool when user requests escalation, or when user expresses frustration.`,
});
