const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.objetivoEstrategico.findMany({ include: { eje: true } })
  .then(objs => console.log(JSON.stringify(objs, null, 2)))
  .finally(() => prisma.$disconnect());
