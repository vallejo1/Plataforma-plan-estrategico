import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ApiError } from '../../utils/ApiError';

const prisma = new PrismaClient();

class StrategicHierarchyService {
  static async updateEjesBatchByPei(peiId: string, ejes: any[]) {
    try {
      await prisma.$transaction(async (tx: any) => {
        // Valida la existencia del PEI
        const pei = await tx.pei.findUnique({ where: { id: peiId } });
        if (!pei) {
          throw new ApiError('RESOURCE_NOT_FOUND', 'No existe el PEI', 404);
        }

        // Valida que todos los ejes pertenecen al PEI
        for (const eje of ejes) {
          if (eje.peiId !== peiId) {
            throw new ApiError('VALIDATION_ERROR', 'El eje no pertenece al PEI', 422);
          }
        }

        // Actualiza los ejes en lote
        for (const eje of ejes) {
          await tx.eje.upsert({
            where: { id: eje.id },
            create: { ...eje },
            update: { ...eje },
          });
        }
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateObjetivosBatchByEje(ejeId: string, objetivos: any[]) {
    try {
      await prisma.$transaction(async (tx: any) => {
        // Valida la existencia del Eje
        const eje = await tx.eje.findUnique({ where: { id: ejeId } });
        if (!eje) {
          throw new ApiError('RESOURCE_NOT_FOUND', 'No existe el Eje', 404);
        }

        // Valida que todos los objetivos pertenecen al Eje
        for (const objetivo of objetivos) {
          if (objetivo.ejeId !== ejeId) {
            throw new ApiError('VALIDATION_ERROR', 'El objetivo no pertenece al Eje', 422);
          }
        }

        // Actualiza los objetivos en lote
        for (const objetivo of objetivos) {
          await tx.objetivo.upsert({
            where: { id: objetivo.id },
            create: { ...objetivo },
            update: { ...objetivo },
          });
        }
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateResultadosBatchByObjetivo(objetivoId: string, resultados: any[]) {
    try {
      await prisma.$transaction(async (tx: any) => {
        // Valida la existencia del Objetivo
        const objetivo = await tx.objetivo.findUnique({ where: { id: objetivoId } });
        if (!objetivo) {
          throw new ApiError('RESOURCE_NOT_FOUND', 'No existe el Objetivo', 404);
        }

        // Valida que todos los resultados pertenecen al Objetivo
        for (const resultado of resultados) {
          if (resultado.objetivoId !== objetivoId) {
            throw new ApiError('VALIDATION_ERROR', 'El resultado no pertenece al Objetivo', 422);
          }
        }

        // Actualiza los resultados en lote
        for (const resultado of resultados) {
          await tx.resultado.upsert({
            where: { id: resultado.id },
            create: { ...resultado },
            update: { ...resultado },
          });
        }
      });
    } catch (error) {
      throw error;
    }
  }
}

export { StrategicHierarchyService };
