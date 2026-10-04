import {
  apiRequest,
  eliminarToken,
  guardarToken,
} from "./api";

import type {
  LoginRequest,
  LoginResponse,
  SesionResponse,
  UsuarioAutenticado,
} from "../types/auth";

export const authService = {
  login: async (
    credenciales: LoginRequest
  ): Promise<UsuarioAutenticado> => {
    const respuesta =
      await apiRequest<LoginResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(credenciales),
        }
      );

    guardarToken(respuesta.data.token);

    return respuesta.data.usuario;
  },

  obtenerSesionActual: async (
  ): Promise<UsuarioAutenticado> => {
    const respuesta =
      await apiRequest<SesionResponse>(
        "/auth/me",
        {
          method: "GET",
          auth: true,
        }
      );

    return respuesta.data.usuario;
  },

  logout: (): void => {
    eliminarToken();
  },
};