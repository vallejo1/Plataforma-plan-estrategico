import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const ejes = await prisma.ejeEstrategico.findMany({
    orderBy: { codigo: 'asc' }
  });
  console.log("Ejes guardados:", ejes.map(e => ({ codigo: e.codigo, nombre: e.nombre, peso: e.peso_relativo })));
}
check().finally(() => prisma.$disconnect());
