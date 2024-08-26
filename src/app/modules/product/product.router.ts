import express from 'express';
import { ProductController } from './product.controller';


const router = express.Router();

router.post('/create', ProductController.createProduct);
router.get('/:id', ProductController.getSingleProduct);
router.get('/', ProductController.getAllProduct);

router.delete('/:id', ProductController.deleteProduct);

router.patch(
  '/:id',

  ProductController.updateProduct
);

export const ProductRoutes = router;