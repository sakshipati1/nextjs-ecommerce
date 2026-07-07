import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    society: { type: String, required: true },
    flat: { type: String, required: true },
    phone: { type: String, required: true },
    payment: { type: String, required: true },
    total: { type: Number, required: true },
    items: [{ label: String, price: Number }],
    status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
