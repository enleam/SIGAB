import { apiRequest } from "./api";

interface SolicitarRestablecimientoResponse {
  ok: boolean;
  message: string;
}

interface RestablecerContrasenaResponse {
  ok: boolean;
  message: string;
}

export const passwordResetService = {
  solicitarRestablecimiento: async (
    correo: string
  ): Promise<SolicitarRestablecimientoResponse> => {
    return apiRequest<SolicitarRestablecimientoResponse>(
      "/password-reset/solicitar",
      {
        method: "POST",
        body: JSON.stringify({
          correo,
        }),
      }
    );
  },

  restablecerContrasena: async (
    token: string,
    nuevaContrasena: string
  ): Promise<RestablecerContrasenaResponse> => {
    return apiRequest<RestablecerContrasenaResponse>(
      "/password-reset/restablecer",
      {
        method: "POST",
        body: JSON.stringify({
          token,
          nuevaContrasena,
        }),
      }
    );
  },
};