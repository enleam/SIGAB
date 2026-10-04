import { apiRequest } from "./api";

import type { PerfilEstudiante } from "../types/estudiante";

interface PerfilEstudianteResponse {
  ok: boolean;
  data: PerfilEstudiante;
}

export const estudianteService = {
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