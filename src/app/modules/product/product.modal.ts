import mongoose, { Schema, model } from "mongoose";
import { IProduct, ProductModel } from "./product.interface";

const ProductSchema: Schema = new Schema<IProduct,ProductModel>({
    category: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true }
  });
  export const Product = model<IProduct, ProductModel>('Product', ProductSchema);
//   const Product = mongoose.model<IProduct>('Product', ProductSchema);