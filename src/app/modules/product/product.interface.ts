import { Model } from "mongoose";

 export type IProduct =  {
    category: string;
    title: string;
    price: number;
    quantity: number;
    description: string;
    rating: number;
    image: string;
  }
  export type ProductModel = Model<IProduct, Record<string, unknown>>;

  export type IProductFilters = {
    searchTerm?: string;
    title?: string;
    category?: string;
  };