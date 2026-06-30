import { Router } from 'express';
import {
  listProducts,
  listAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createProductSchema, updateProductSchema } from '../schemas';

const router = Router();

// Rotas públicas
router.get('/admin/all', requireAuth, listAllProducts);
router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', requireAuth, validate(createProductSchema), createProduct);
router.put('/:id', requireAuth, validate(updateProductSchema), updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
