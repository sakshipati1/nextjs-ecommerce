export const dynamic = "force-dynamic";
import connectDB from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import Product from "@/models/product";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generatevector(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
  });

  const values =
    response?.embedding?.values || response?.embeddings?.[0]?.values;

  if (!values) {
    console.log(
      "👉 DEBUG: Gemini Full Response Object structure:",
      JSON.stringify(response, null, 2),
    );
    throw new Error(
      "Failed to extract embedding values from Gemini API response.",
    );
  }

  return values;
}

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const queryText = body.q || body.query;

    if (!queryText) {
      return Response.json(
        { error: "Query payload text is missing" },
        { status: 400 },
      );
    }

    // 1. Turn the user's search text into a vector array
    const queryVector = await generatevector(queryText);

    console.log(
      "👉 DEBUG: Your query vector array actual length is:",
      queryVector.length,
    );

    // 2. Query your Atlas vector index using an updated aggregation pipeline
    const results = await Product.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 100,
          limit: 5,
        },
      },
      {
        // Project document fields along with the calculated vector score
        $project: {
          _id: 1,
          title: 1,
          price: 1,
          description: 1,
          category: 1,
          image: 1,
          score: { $meta: "vectorSearchScore" }, // Captures how closely the item matches
        },
      },
      {
        // Base baseline filter: Drops anything universally irrelevant below 0.65
        $match: {
          score: { $gte: 0.65 },
        },
      },
    ]);

    // 3. DYNAMIC FILTER: Cleanly drop unrelated trailing recommendations (like the Bean Bag)
    let finalFilteredResults = [];

    if (results.length > 0) {
      const topMatchScore = results[0].score;
      console.log(`🎯 Top search match score is: ${topMatchScore}`);

      finalFilteredResults = results.filter((item) => {
        // Calculate the similarity gap between the top result and the current item
        const scoreGap = topMatchScore - item.score;

        // Keep item if it stays within a strict 0.08 margin of the best result
        const isCloseMatch = scoreGap <= 0.08;

        if (!isCloseMatch) {
          console.log(
            `✂️ Dropped "${item.title}" (Score: ${item.score}) - Failed relative score gap test.`,
          );
        }
        return isCloseMatch;
      });
    }

    console.log(
      `👉 DEBUG: Found ${finalFilteredResults.length} relevant products after relative gap filtering.`,
    );

    return Response.json(finalFilteredResults);
  } catch (error) {
    console.error("Vector search failure:", error);
    return Response.json(
      { error: "Something went wrong during search" },
      { status: 500 },
    );
  }
}
