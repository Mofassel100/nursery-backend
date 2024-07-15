/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import httpStatus from 'http-status';
import { IProduct, IProductFilters } from './product.interface';
import { IPaginationOptions } from '../../interface/pagination';
import { IGenericResponse } from '../../interface/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { productSearchableFields } from './product.constant';
import { Product } from './product.modal';
import AppError from '../../errors/AppError';

const getAllProduct = async (
  filters: IProductFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IProduct[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: productSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Product.find(whereConditions).sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findOne({ id })
  return result;
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>
): Promise<IProduct | null> => {
  const isExist = await Product.findOne({ id });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found !');
  }

  const {  ...productData } = payload;

  const updatedProductData: Partial<IProduct> = { ...productData };

  

 

  const result = await Product.findOneAndUpdate({ id }, updatedProductData, {
    new: true,
  });
  return result;
};

const deleteProduct = async (id: string): Promise<IProduct | null> => {
  // check if the product is exist
  const isExist = await Product.findOne({ id });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete product first
    const product = await Product.findOneAndDelete({ id }, { session });
    if (!product) {
      throw new AppError(404, 'Failed to delete product');
    }
   
    session.commitTransaction();
    session.endSession();

    return product;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const ProductService = {
getAllProduct,
getSingleProduct,
updateProduct,
deleteProduct,
};