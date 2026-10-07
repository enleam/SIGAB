export const ROUTES = {
  HOME: "/",

  LOGIN: "/login",
  FORGOT_PASSWORD: "/recuperar-contrasena",
  RESET_PASSWORD: "/restablecer-contrasena",

  ESTUDIANTE: {
    HOME: "/estudiante",
    PERFIL: "/estudiante/perfil",
  },

  SECRETARIO: {
    HOME: "/secretario",

    EVALUACION:
      "/secretario/convocatorias/:convocatoriaId/evaluacion",

    evaluacion: (convocatoriaId: number | string) =>
      `/secretario/convocatorias/${convocatoriaId}/evaluacion`,
  },

  ADMINISTRADOR: {
    HOME: "/administrador",
    SECRETARIOS: "/administrador/secretarios",
  },

  NOT_FOUND: "*",
} as const;