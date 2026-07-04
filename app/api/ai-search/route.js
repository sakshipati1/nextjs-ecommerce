import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the Gemini client using your secure environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { query, products } = await request.json();

    // If search is empty, return all products immediately
    if (!query || !query.trim()) {
      return NextResponse.json({ results: products });
    }

    // 1. Format the product catalog into a highly readable block for the AI
    const productCatalog = products
      .map((p) => {
        const id = p._id || p.id;
        return `ID: ${id} | Title: ${p.title} | Category: ${p.category || "Uncategorized"} | Description: ${p.description || "N/A"} | Price: $${p.price || 0}`;
      })
      .join("\n");

    // 2. Build a highly specific prompt instructing the model on its task
    const prompt = `
      You are an e-commerce search engine helper. Analyze the user's search query and match it against the product catalog below.
      
      Look for direct matches, categories, and semantic context (e.g., if they search for "clothing", match shirts or pants; if they search for "warm", match jackets).
      
      User Search Query: "${query}"
      
      Product Catalog:
      ${productCatalog}
      
      Output requirement: Return a JSON array containing ONLY the string IDs of the matched products. Example: ["123", "456"]. If no items match, return an empty array [].
    `;

    // 3. Request the response from Gemini using Structured JSON output
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // This forces Gemini to send back clean JSON without markdown code blocks
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text ? response.text.trim() : "[]";

    // 4. Parse the array of IDs returned by the AI
    const matchedIds = JSON.parse(responseText);

    // 5. Filter the original array, matching string-to-string to prevent type mismatches
    const filtered = products.filter((p) => {
      const targetId = String(p._id || p.id);
      return matchedIds.map(String).includes(targetId);
    });

    return NextResponse.json({ results: filtered });
  } catch (error) {
    console.error("❌ Gemini Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during AI search execution." },
      { status: 500 },
    );
  }
}
