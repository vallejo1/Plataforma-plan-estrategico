import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const result = await prisma.resultadoEstrategico.findFirst();
  console.log("Resultado ID:", result?.id);
}
check().finally(() => prisma.$disconnect());
