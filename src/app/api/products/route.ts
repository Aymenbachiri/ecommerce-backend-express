import { connectToDB } from "@/lib/database/database";
import Product from "@/lib/database/models/Product";
import { productSchema } from "@/lib/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products
 *     description: Fetches all products from the database.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The title of the product.
 *                   description:
 *                     type: string
 *                     description: The content of the product.
 *                   category:
 *                     type: string
 *                     description: The category of the product.
 *                     enum:
 *                       - men
 *                       - women
 *                       - electronics
 *                       - jewelry
 *                   imageUrl:
 *                     type: string
 *                     description: The URL of the product's image.
 *                     format: url
 *                   price:
 *                     type: number
 *                     description: The price of the product.
 *                   creator:
 *                     type: string
 *                     description: The creator of the product.
 *
 *       500:
 *         description: Failed to fetch products.
 */

export async function GET() {
  try {
    await connectToDB();

    const products = await Product.find();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("products Retrieval Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve products", details: error },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   title:
 *                     type: string
 *                     description: The title of the product.
 *                   description:
 *                     type: string
 *                     description: The content of the product.
 *                   category:
 *                     type: string
 *                     description: The category of the product.
 *                     enum:
 *                       - men
 *                       - women
 *                       - electronics
 *                       - jewelry
 *                   imageUrl:
 *                     type: string
 *                     description: The URL of the product's image.
 *                     format: url
 *                   price:
 *                     type: number
 *                     description: The price of the product.
 *                   creator:
 *                     type: string
 *                     description: The creator of the product.
 *     responses:
 *       201:
 *         description: Product has been created.
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         description: The field that caused the validation error.
 *                       message:
 *                         type: string
 *                         description: The validation error message.
 *       500:
 *         description: Failed to create Product.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedBody = productSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          errors: parsedBody.error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { title, description, category, imageUrl, creator, price } =
      parsedBody.data;

    await connectToDB();

    const newProduct = new Product({
      title,
      description,
      category,
      imageUrl,
      creator,
      price,
    });

    await newProduct.save();

    return NextResponse.json("product has been created", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Input validation error:", error.issues);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    } else {
      console.error("Error during product creation:", error);
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }
  }
}
