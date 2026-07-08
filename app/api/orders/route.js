import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/order";

// 1. Your existing POST function (handles creating orders)
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { items, totalAmount, shippingAddress } = body;

    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newOrder = await Order.create({
      items,
      totalAmount,
      shippingAddress,
      status: "Pending",
    });

    return NextResponse.json(
      { message: "Order placed successfully!", order: newOrder },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 2. PASTE THE NEW GET FUNCTION HERE (handles fetching orders)
export async function GET() {
  try {
    await dbConnect();

    // Fetches all orders, newest first
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Could not retrieve orders" },
      { status: 500 },
    );
  }
}
export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing order ID or status values" },
        { status: 400 },
      );
    }

    // Find the order and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { returnDocument: "after" }, // Returns the newly modified document
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order status updated successfully!", order: updatedOrder },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
