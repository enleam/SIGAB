import { apiRequest } from "./api";

import type {
  Secretario,
  RegistrarSecretarioPayload,
  ActualizarSecretarioPayload,
} from "../types/secretario";

interface SecretarioResponse {
  ok: boolean;
  data: Secretario;
}

interface SecretariosResponse {
  ok: boolean;
  data: Secretario[];
}

export const secretarioService = {
  listar: async (termino?: string): Promise<Secretario[]> => {
    const query = termino
      ? `?q=${encodeURIComponent(termino)}`
      : "";

    const respuesta =
      await apiRequest<SecretariosResponse>(
        `/secretarios${query}`,
        {
          method: "GET",
          auth: true,
        }
      );

    return respuesta.data;
  },

  obtenerPorId: async (
    usuarioId: number
  ): Promise<Secretario> => {
    const respuesta =
      await apiRequest<SecretarioResponse>(
        `/secretarios/${usuarioId}`,
        {
          method: "GET",
          auth: true,
        }
      );

    return respuesta.data;
  },

  registrar: async (
    datos: RegistrarSecretarioPayload
  ): Promise<Secretario> => {
    const respuesta =
      await apiRequest<SecretarioResponse>(
        "/secretarios",
        {
          method: "POST",
          auth: true,
          body: JSON.stringify(datos),
        }
      );

    return respuesta.data;
  },

  actualizar: async (
    usuarioId: number,
    datos: ActualizarSecretarioPayload
  ): Promise<Secretario> => {
    const respuesta =
      await apiRequest<SecretarioResponse>(
        `/secretarios/${usuarioId}`,
        {
          method: "PUT",
          auth: true,
          body: JSON.stringify(datos),
        }
      );

    return respuesta.data;
  },

  desactivar: async (
    usuarioId: number
  ): Promise<Secretario> => {
    const respuesta =
      await apiRequest<SecretarioResponse>(
        `/secretarios/${usuarioId}/desactivar`,
        {
          method: "PATCH",
          auth: true,
        }
      );

    return respuesta.data;
  },
};
