import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { assert } from "convex-helpers";
import { StorageActionWriter } from "convex/server";
import { Id } from "../_generated/dataModel";

const AI_MODELS = {
  Image: groq.languageModel("llama-3.3-70b-versatile"),
  pdf: groq.languageModel("llama-3.3-70b-versatile"),
  html: groq.languageModel("llama-3.3-70b-versatile"),
} as const satisfies Record<string, any>;

const SUPPORTED_IMAGE_TYPES = [  
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

const SYSTEM_PROMPT = {
  image:
    "You turn images into text. if it is a photo of a document, extract the text content. if it is a photo of a scene, describe the scene in detail.",
  pdf: "You extract text content from PDF files. Extract the text content while preserving the structure and formatting as much as possible.",
  html: "You extract the main textual content from HTML files, removing any boilerplate, ads, or navigation elements. Preserve the structure and formatting of the main content as much as possible.",
};

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs,
): Promise<string> {
  const { storageId, filename, bytes, mimeType } = args;
  const url = await ctx.storage.getUrl(storageId);
  assert(url, "Failed to get URL from storage");

  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    return extractImageText(url);
  }
  if (mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, filename);
  }

  if (mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType);
  }
  throw new Error(`Unsupported MIME type: ${mimeType}`);
}

async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string,
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error("Failed to get file content");
  }

  const text = new TextDecoder().decode(arrayBuffer);

  if (mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html as any,
      system: SYSTEM_PROMPT.html,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "text",
              text: "Extract the text and print it in a markdown format without explaining that you'll do so.",
            },
          ],
        },
      ],
    });

    return result.text;
  }

  return text;
}

async function extractPdfText(
  url: string,
  mimeType: string,
  filename: string,
): Promise<string> {
  const response = await generateText({
    model: AI_MODELS.pdf as any,
    system: SYSTEM_PROMPT.pdf,
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: new URL(url), mimeType, filename },
          {
            type: "text",
            text: "Extract the text content from the PDF file without explaining you'll do so",
          },
        ],
      },
    ],
  });
  return response.text;
}

async function extractImageText(url: string): Promise<string> {
  const response = await generateText({
    model: AI_MODELS.Image as any,
    system: SYSTEM_PROMPT.image,
    messages: [{ role: "user", content: [{ type: "image", image: url }] }],
  });
  return response.text;
}
