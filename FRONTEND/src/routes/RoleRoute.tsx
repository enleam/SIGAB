import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import type { RolUsuario } from "../types/auth";

interface RoleRouteProps {
  rolesPermitidos: RolUsuario[];
}

const RoleRoute = ({
  rolesPermitidos,
}: RoleRouteProps) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    if (usuario.rol === "ESTUDIANTE") {
      return (
        <Navigate
          to="/estudiante"
          replace
        />
      );
    }

    if (usuario.rol === "SECRETARIO") {
      return (
        <Navigate
          to="/secretario"
          replace
        />
      );
    }

    if (usuario.rol === "ADMINISTRADOR") {
      return (
        <Navigate
          to="/administrador"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default RoleRoute;