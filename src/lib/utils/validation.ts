import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["men", "women", "electronics", "jewelry"]),
  imageUrl: z.string().url().min(1, "Image URL is required"),
  price: z.number().min(1, "Price is required"),
  creator: z.string().min(1, "Creator is required"),
});
