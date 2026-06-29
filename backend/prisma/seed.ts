import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@bolos.com' },
    update: {},
    create: { email: 'admin@bolos.com', passwordHash },
  });

  const products = [
  {
    name: 'Bolo Red Velvet',
    description: 'Massa fofinha com recheio de cream cheese',
    price: 89.90,
    flavor: 'Red Velvet',
    size: 'Médio'
  },
  {
    name: 'Bolo de Chocolate',
    description: 'Ganache 70% cacau, 3 camadas',
    price: 75.00,
    flavor: 'Chocolate',
    size: 'Médio'
  },
  {
    name: 'Bolo de Morango',
    description: 'Morangos frescos e chantilly artesanal',
    price: 82.00,
    flavor: 'Morango',
    size: 'Médio'
  },
];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {
        flavor: product.flavor,
        size: product.size,
      },
      create: product,
    });
  }

  console.log('Seed de produtos e admin concluído. Admin: admin@bolos.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());