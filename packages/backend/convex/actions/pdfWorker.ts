"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";

// Using require to avoid TypeScript module resolution issues
const pdf = require("pdf-parse/lib/pdf-parse.js") as (
  buffer: Buffer,
) => Promise<{ text: string; numpages: number }>;

export const extractPdfTextAction = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, { url }) => {
    try {
      // Fetch the PDF from the URL as binary data
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }

      const pdfBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(pdfBuffer);

      // Parse the PDF to extract text
      let pdfData;
      try {
        pdfData = await pdf(buffer);
      } catch (error) {
        // Handle encrypted or corrupted PDFs
        throw new Error(
          `Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      // Extract text from PDF
      let extractedText = pdfData.text || "";

      // Validate extraction
      if (!extractedText.trim()) {
        throw new Error(
          "PDF appears to be empty or contains no extractable text",
        );
      }

      // Limit text size to avoid token limit issues (first 10,000 characters)
      const MAX_CHARS = 10000;
      if (extractedText.length > MAX_CHARS) {
        extractedText =
          extractedText.substring(0, MAX_CHARS) +
          "\n[... content truncated ...]";
      }

      return extractedText;
    } catch (error) {
      throw new Error(
        `PDF extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});
