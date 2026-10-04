export type RolUsuario =
  | "ESTUDIANTE"
  | "SECRETARIO"
  | "ADMINISTRADOR";

export interface UsuarioAutenticado {
  id: number;
  correo: string;
  rol: RolUsuario;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  ok: boolean;
  message: string;

  data: {
    token: string;
    usuario: UsuarioAutenticado;
  };
}

export interface SesionResponse {
  ok: boolean;

  data: {
    usuario: UsuarioAutenticado;
  };
}