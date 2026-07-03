import connect from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server"; // 1. Added import

export async function GET() {
  try {
    await connect(); // Make sure this function name matches your export in lib/db
    const products = await Product.find({});

    // 2. Use NextResponse.json
    return NextResponse.json(products);
  } catch (error) {
    console.error("Database Error:", error);

    // 3. Graceful fallback error response
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 },
    );
  }
}
