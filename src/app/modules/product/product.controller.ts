import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import { paginationFields, productFilterableFields } from './product.constant';
import { ProductService } from './product.service';
import sendResponse from '../../utils/sendResponse';
import { IProduct } from './product.interface';
// import { paginationFields } from '../../../constants/pagination';
// import catchAsync from '../../../shared/catchAsync';
// import pick from '../../../shared/pick';
// import sendResponse from '../../../shared/sendResponse';
// import { studentFilterableFields } from './student.constant';
// import { IStudent } from './student.interface';
// import { StudentService } from './student.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const {...productData} = req.body
  

 const result =await ProductService.createProduct(productData)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result
  });
});
const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, productFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ProductService.getAllProduct(
    filters,
    paginationOptions
  );

  sendResponse<IProduct[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully !',
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ProductService.getSingleProduct(id);
  sendResponse<IProduct | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully !',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await ProductService.updateProduct(id, updatedData);

  sendResponse<IProduct | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully !',
    data: result,
  });
});
const deleteProduct  = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductService.deleteProduct(id);

  sendResponse<IProduct | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully !',
    data: result,
  });
});

export const ProductController = {
getAllProduct,
getSingleProduct,
updateProduct,
deleteProduct,
createProduct
};