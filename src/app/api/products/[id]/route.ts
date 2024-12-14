import { connectToDB } from "@/lib/database/database";
import Product from "@/lib/database/models/Product";
import { productSchema } from "@/lib/utils/validation";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     description: Fetches a single product from the database using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the product.
 *
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
 *                   createdAt:
 *                     type: string
 *                     description: The date and time the product was created.
 *                     format: date-time
 *       400:
 *         description: Invalid ID format.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

type Params = Promise<{ id: string }>;
export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    await connectToDB();

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json("Product not found", { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     description: Updates a product in the database using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update.
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
 *       200:
 *         description: Successfully updated the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input or ID format.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    // Parse body once
    const body = await req.json();
    const parseResult = productSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors },
        { status: 400 }
      );
    }

    await connectToDB();

    // Use the validated data from parseResult.data
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      parseResult.data,
      { new: true } // This returns the updated document
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: Product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Removes a product from the database using its unique ID

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *                 deletedProduct:
 *                   type: object
 *                   properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the product.
 *
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
 *                   createdAt:
 *                     type: string
 *                     description: The date and time the product was created.
 *                     format: date-time
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await connectToDB();

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Product deleted successfully",
        deletedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
