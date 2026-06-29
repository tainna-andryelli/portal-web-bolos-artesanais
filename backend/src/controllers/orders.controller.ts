import { Request, Response } from 'express';
import { OrderStatus } from '@prisma/client';
import prisma from '../prisma';

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body as {
      productId: string;
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      size: string;
      deliveryDate: string;
      notes?: string;
    };

    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product || !product.available) {
      res.status(400).json({ error: 'Produto não disponível' });
      return;
    }

    const order = await prisma.order.create({
      data: {
        productId: data.productId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        size: data.size,
        deliveryDate: new Date(data.deliveryDate),
        notes: data.notes,
      },
      include: { product: { select: { name: true } } },
    });

    res.status(201).json({
      orderNumber: order.orderNumber,
      productName: order.product.name,
      deliveryDate: order.deliveryDate,
      status: order.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
}

export async function listOrders(req: Request, res: Response): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const date = req.query.date as string | undefined;

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status: status as OrderStatus } : {}),
        ...(date
          ? {
              deliveryDate: {
                gte: new Date(`${date}T00:00:00`),
                lte: new Date(`${date}T23:59:59`),
              },
            }
          : {}),
      },
      include: { product: { select: { name: true, price: true } } },
      orderBy: { deliveryDate: 'asc' },
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
}

export async function getOrder(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!order) {
      res.status(404).json({ error: 'Pedido não encontrado' });
      return;
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
}

export async function updateOrderStatus(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: OrderStatus };

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Pedido não encontrado' });
      return;
    }

    const order = await prisma.order.update({ where: { id }, data: { status } });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
}