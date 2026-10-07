import { apiRequest } from "./api";

import type {
  EvaluacionConvocatoria,
} from "../types/postulacion";

interface EvaluacionResponse {
  ok: boolean;
  data: EvaluacionConvocatoria;
}

const listarParaEvaluacion = async (
  convocatoriaId: number
): Promise<EvaluacionConvocatoria> => {
  const response =
    await apiRequest<EvaluacionResponse>(
      `/postulaciones/convocatoria/${convocatoriaId}/evaluacion`,
      {
        method: "GET",
        auth: true,
      }
    );

  return response.data;
};

export const postulacionService = {
  listarParaEvaluacion,
};