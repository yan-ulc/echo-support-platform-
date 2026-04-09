import { google } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

// GANTI NAMA MODELNYA JADI INI:
const embeddingModel = google.embedding("gemini-embedding-001");

const rag = new (RAG as any)(components.rag, {
  textEmbeddingModel: embeddingModel,
  embeddingDimension: 768, 
});

export default rag;