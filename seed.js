const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const peiId = 'a84fa8e7-5207-4fcb-a961-428b417d676d';
    const ejes = [
      { codigo: 'E0', nombre: 'Fortalecimiento Institucional y Sostenibilidad', peso: 25 },
      { codigo: 'E1', nombre: 'Gestión del Riesgo y Resiliencia Comunitaria', peso: 25 },
      { codigo: 'E2', nombre: 'Salud Integral, Protección y Hemoderivados', peso: 25 },
      { codigo: 'E3', nombre: 'Respuesta a Emergencias y Crisis', peso: 25 }
    ];
    for(let i=0; i<ejes.length; i++) {
      const e = ejes[i];
      const ejeObj = await prisma.ejeEstrategico.create({
        data: {
          peiId,
          codigo: e.codigo,
          nombre: e.nombre,
          peso_relativo: e.peso,
          orden: i+1
        }
      });
      for(let j=1; j<=2; j++) {
        await prisma.objetivoEstrategico.create({
          data: {
            ejeId: ejeObj.id,
            codigo: e.codigo + '.O' + j,
            nombre: 'Objetivo de prueba ' + j + ' para ' + e.codigo,
            peso_relativo: 50,
            orden: j
          }
        });
      }
    }
    console.log('Exito');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
