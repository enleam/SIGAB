
import { apiRequest } from "./api";

import type { PerfilEstudiante } from "../types/estudiante";

interface PerfilEstudianteResponse {
  ok: boolean;
  data: PerfilEstudiante;
}

export const estudianteService = {
  // HU01 - Consultar perfil del estudiante
  // HU04 - Consultar estado de completitud
  obtenerPerfil: async (): Promise<PerfilEstudiante> => {
    const respuesta =
      await apiRequest<PerfilEstudianteResponse>(
        "/estudiantes/perfil",
        {
          method: "GET",
          auth: true,
        }
      );

    return respuesta.data;
  },
};
