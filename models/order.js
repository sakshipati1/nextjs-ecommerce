// models/order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      societyName: { type: String, required: true },
      wingFlat: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      default: "Pending", // Pending, Processing, Out for Delivery, Delivered
    },
  },
  { timestamps: true }, // Automatically creates createdAt and updatedAt fields
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
