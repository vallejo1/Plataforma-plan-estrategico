const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.pei.findMany().then(peis => {
  console.log('PEI IDs:');
  peis.forEach(p => console.log(`- ${p.id} (${p.nombre})`));
  prisma.$disconnect();
});
