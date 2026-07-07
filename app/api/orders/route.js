import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/order";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, society, flat, phone, payment, total, items } = body;

    if (
      !name ||
      !society ||
      !flat ||
      !phone ||
      !payment ||
      total === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const order = await Order.create({
      name,
      society,
      flat,
      phone,
      payment,
      total,
      items: items || [],
    });

    return NextResponse.json(
      { success: true, message: "Order placed successfully", order },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to place order", details: error.message },
      { status: 500 },
    );
  }
}
