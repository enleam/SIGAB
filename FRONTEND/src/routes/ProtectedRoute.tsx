import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const {
    cargando,
    estaAutenticado,
  } = useAuth();

  if (cargando) {
    return (
      <main>
        <p>Verificando sesión...</p>
      </main>
    );
  }

  if (!estaAutenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;