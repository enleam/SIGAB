import { createContext } from "react";

import type {
  LoginRequest,
  UsuarioAutenticado,
} from "../types/auth";

export interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  cargando: boolean;
  estaAutenticado: boolean;

  login: (
    credenciales: LoginRequest
  ) => Promise<UsuarioAutenticado>;

  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType | null>(null);