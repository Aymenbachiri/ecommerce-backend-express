import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "electronics", "jewelry"],
    },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    creator: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
