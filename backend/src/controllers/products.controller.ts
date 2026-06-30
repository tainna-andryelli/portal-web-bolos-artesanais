import { Request, Response } from 'express';
import prisma from '../prisma';

export async function listProducts(req: Request, res: Response): Promise<void> {
  const flavor = req.query.flavor as string | undefined;
  const size = req.query.size as string | undefined;
  const occasion = req.query.occasion as string | undefined;

  const products = await prisma.product.findMany({
    where: {
      available: true,
      ...(flavor ? { flavor } : {}),
      ...(size ? { size } : {}),
      ...(occasion ? { occasion } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(products);
}

export async function listAllProducts(_req: Request, res: Response): Promise<void> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(products);
}

export async function getProduct(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }
  res.json(product);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json(product);
}

export async function updateProduct(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }

  const product = await prisma.product.update({ where: { id }, data: req.body });
  res.json(product);
}

export async function deleteProduct(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }

  const ordersCount = await prisma.order.count({ where: { productId: id } });
  if (ordersCount > 0) {
    res.status(409).json({ error: 'Este produto possui pedidos vinculados e não pode ser excluído. Marque-o como indisponível.' });
    return;
  }

  await prisma.product.delete({ where: { id } });
  res.status(204).send();
}
