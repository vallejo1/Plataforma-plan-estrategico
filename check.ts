import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const eje = await prisma.ejeEstrategico.findUnique({ where: { id: '8779cc84-c22d-4573-bc4f-7cb148c38adf' }});
  const pei = await prisma.pei.findUnique({ where: { id: '8779cc84-c22d-4573-bc4f-7cb148c38adf' }});
  console.log("Eje:", eje);
  console.log("Pei:", pei);
}
check().finally(() => prisma.$disconnect());
