import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { ApiError } from '../../utils/ApiError';

const prisma = new PrismaClient();

const decimalRegex = /^-?\d+(\.\d+)?$/;

export const MetaIndicadorCreateSchema = z.object({
  indicadorId: z.string().uuid(),
  anio: z.number().int(),
  valorMeta: z.string().regex(decimalRegex, "Debe ser un número válido"),
  observacion: z.string().nullable().optional(),
});

export const MetaIndicadorUpdateSchema = z.object({
  valorMeta: z.string().regex(decimalRegex, "Debe ser un número válido").optional(),
  observacion: z.string().nullable().optional(),
});

export class AnnualTargetService {
  static async createAnnualTarget(indicadorId: string, data: { anio: number, valorMeta: string, observacion?: string | null }) {
    const validData = MetaIndicadorCreateSchema.parse({ indicadorId, ...data });

    try {
      const result = await prisma.$transaction(async (tx) => {
        const indicador = await tx.indicador.findUnique({
          where: { id: indicadorId },
          include: { 
            resultado: { 
              include: { 
                objetivo: { 
                  include: { 
                    eje: { 
                      include: { 
                        pei: true 
                      } 
                    } 
                  } 
                } 
              } 
            } 
          }
        });

        if (!indicador) {
          throw new ApiError('RESOURCE_NOT_FOUND', "Indicador no encontrado", 404);
        }

        const pei = indicador.resultado.objetivo.eje.pei;
        if (validData.anio < pei.anioInicial || validData.anio > pei.anioFinal) {
          throw new ApiError('VALIDATION_ERROR', "El año está fuera del horizonte del PEI", 422);
        }

        if (validData.valorMeta.startsWith('-')) {
          throw new ApiError('VALIDATION_ERROR', "No se permiten metas negativas", 400);
        }

        const decimalValue = new Prisma.Decimal(validData.valorMeta);
        if (indicador.unidadMedidaTipo === 'PORCENTAJE' || indicador.unidadMedidaTipo === 'COBERTURA') {
          if (decimalValue.toNumber() > 100) {
            throw new ApiError('VALIDATION_ERROR', "El valor no puede ser mayor a 100 para esta unidad", 400);
          }
        }

        const target = await tx.metaIndicador.create({
          data: {
            indicadorId: validData.indicadorId,
            anio: validData.anio,
            valorMeta: decimalValue,
            observacion: validData.observacion
          }
        });

        const allTargets = await tx.metaIndicador.findMany({ where: { indicadorId: validData.indicadorId } });
        const requiredYears = Array.from({ length: pei.anioFinal - pei.anioInicial + 1 }, (_, i) => pei.anioInicial + i);
        const configuredYears = allTargets.map(t => t.anio);
        const missingYears = requiredYears.filter(y => !configuredYears.includes(y));
        const complete = missingYears.length === 0;

        return {
          meta: target,
          configuration: {
            requiredYears,
            configuredYears,
            missingYears,
            complete,
            warnings: complete ? [] : ['TARGET_YEARS_INCOMPLETE']
          }
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateAnnualTarget(metaId: string, data: { valorMeta?: string, observacion?: string | null }) {
    const validData = MetaIndicadorUpdateSchema.parse(data);

    try {
      const result = await prisma.$transaction(async (tx) => {
        const meta = await tx.metaIndicador.findUnique({
          where: { id: metaId },
          include: { 
            indicador: { 
              include: { 
                resultado: { 
                  include: { 
                    objetivo: { 
                      include: { 
                        eje: { 
                          include: { 
                            pei: true 
                          } 
                        } 
                      } 
                    } 
                  } 
                } 
              } 
            } 
          }
        });

        if (!meta) {
          throw new ApiError('RESOURCE_NOT_FOUND', "Meta no encontrada", 404);
        }

        const pei = meta.indicador.resultado.objetivo.eje.pei;

        if (pei.estado === 'ACTIVO' || pei.activo) {
          throw new ApiError('FORBIDDEN', "No se pueden modificar metas de un PEI activo", 400);
        }

        if (meta.anio < pei.anioInicial || meta.anio > pei.anioFinal) {
          throw new ApiError('VALIDATION_ERROR', "El año está fuera del horizonte del PEI", 422);
        }

        const updateData: Record<string, unknown> = {};
        if (validData.valorMeta !== undefined) {
          if (validData.valorMeta.startsWith('-')) {
            throw new ApiError('VALIDATION_ERROR', "No se permiten metas negativas", 400);
          }
          const decimalValue = new Prisma.Decimal(validData.valorMeta);
          if (meta.indicador.unidadMedidaTipo === 'PORCENTAJE' || meta.indicador.unidadMedidaTipo === 'COBERTURA') {
            if (decimalValue.toNumber() > 100) {
              throw new ApiError('VALIDATION_ERROR', "El valor no puede ser mayor a 100 para esta unidad", 400);
            }
          }
          updateData.valorMeta = decimalValue;
        }
        if (validData.observacion !== undefined) {
          updateData.observacion = validData.observacion;
        }

        const updatedTarget = await tx.metaIndicador.update({
          where: { id: metaId },
          data: updateData
        });

        const allTargets = await tx.metaIndicador.findMany({ where: { indicadorId: meta.indicadorId } });
        const requiredYears = Array.from({ length: pei.anioFinal - pei.anioInicial + 1 }, (_, i) => pei.anioInicial + i);
        const configuredYears = allTargets.map(t => t.anio);
        const missingYears = requiredYears.filter(y => !configuredYears.includes(y));
        const complete = missingYears.length === 0;

        return {
          meta: updatedTarget,
          configuration: {
            requiredYears,
            configuredYears,
            missingYears,
            complete,
            warnings: complete ? [] : ['TARGET_YEARS_INCOMPLETE']
          }
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}