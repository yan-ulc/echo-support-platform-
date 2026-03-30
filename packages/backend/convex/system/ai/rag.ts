import { RAG } from "@convex-dev/rag";
import { cohere } from "@ai-sdk/cohere";
import { embed } from "ai";
import { components } from "../../_generated/api";
import { google } from "@ai-sdk/google";
import { de } from "zod/v4/locales";



const rag = new RAG(components.rag,  {
  textEmbeddingModel:  google.embedding('gemini-embedding-001'),
  embeddingDimension: 1536,
})

export default rag;
