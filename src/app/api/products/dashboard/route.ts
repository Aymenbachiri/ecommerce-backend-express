import { connectToDB } from "@/lib/database/database";
import Product from "@/lib/database/models/Product";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/products/dashboard:
 *   get:
 *     summary: Retrieve a list of products by creator
 *     description: Fetches products filtered by the specified creator. If no creator is provided, all products will be returned.
 *     parameters:
 *       - name: creator
 *         in: query
 *         required: true
 *         description: The creator of the products to filter by.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6727cfbd0062ef926c94bc1d"
 *                   title:
 *                     type: string
 *                     example: "iphone 20"
 *                   description:
 *                     type: string
 *                     example: "black iphone 16"
 *                   category:
 *                     type: string
 *                     example: "electronics"
 *                   imageUrl:
 *                     type: string
 *                     example: "https://www.apple.com/newsroom/images/2024/09/apple-introduces-iphone-…"
 *                   price:
 *                     type: number
 *                     example: 2000
 *                   creator:
 *                     type: string
 *                     example: "apple"
 *       400:
 *         description: Bad request if the creator parameter is missing or empty.
 *       500:
 *         description: Internal server error if fetching products fails.
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creator = searchParams.get("creator");

    if (creator === "") {
      return NextResponse.json(
        { error: "Creator is required" },
        { status: 400 }
      );
    }

    await connectToDB();
    const query = creator ? { creator } : {};
    const products = await Product.find(query);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("products Retrieval Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
