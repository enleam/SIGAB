import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { AuthContext } from "./AuthContext";

import { authService } from "../services/auth.service";
import { obtenerToken } from "../services/api";

import type {
  LoginRequest,
  UsuarioAutenticado,
} from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [usuario, setUsuario] =
    useState<UsuarioAutenticado | null>(null);

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const recuperarSesion = async () => {
      const token = obtenerToken();

      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const usuarioActual =
          await authService.obtenerSesionActual();

        setUsuario(usuarioActual);
      } catch {
        authService.logout();
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    recuperarSesion();
  }, []);

  useEffect(() => {
    const manejarSesionExpirada = () => {
      authService.logout();
      setUsuario(null);
    };

    window.addEventListener(
      "sigab:sesion-expirada",
      manejarSesionExpirada
    );

    return () => {
      window.removeEventListener(
        "sigab:sesion-expirada",
        manejarSesionExpirada
      );
    };
  }, []);

  const login = async (
    credenciales: LoginRequest
  ): Promise<UsuarioAutenticado> => {
    const usuarioAutenticado =
      await authService.login(credenciales);

    setUsuario(usuarioAutenticado);

    return usuarioAutenticado;
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const estaAutenticado = usuario !== null;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        estaAutenticado,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};