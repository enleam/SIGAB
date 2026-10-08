
import { apiRequest } from "./api";

export interface CVEstudiante {
  documentoId: string;
  archivoId: string;
  nombreOriginal: string;
  mimeType: string;
  tamanoBytes: number | string;
  cargadoEn: string;
  vigente: boolean;
}

interface CVResponse {
  ok: boolean;
  data: CVEstudiante | null;
}

interface SubirCVResponse {
  ok: boolean;
  mensaje: string;
  data: CVEstudiante;
}

export const cvService = {
  obtenerCV: async (): Promise<CVEstudiante | null> => {
    const respuesta = await apiRequest<CVResponse>(
      "/estudiantes/cv",
      {
        method: "GET",
        auth: true,
      }
    );

    return respuesta.data;
  },

  subirCV: async (archivo: File): Promise<CVEstudiante> => {
    const formData = new FormData();

    // El backend espera el campo "cv".
    formData.append("cv", archivo);

    const respuesta = await apiRequest<SubirCVResponse>(
      "/estudiantes/cv",
      {
        method: "POST",
        auth: true,
        body: formData,
      }
    );

    return respuesta.data;
  },

  visualizarCV: async (): Promise<Blob> => {
    return apiRequest<Blob>(
      "/estudiantes/cv/visualizar",
      {
        method: "GET",
        auth: true,
        responseType: "blob",
      }
    );
  },

  descargarCV: async (): Promise<Blob> => {
    return apiRequest<Blob>(
      "/estudiantes/cv/descargar",
      {
        method: "GET",
        auth: true,
        responseType: "blob",
      }
    );
  },
};
