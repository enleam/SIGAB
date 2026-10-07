import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "./paths";

function HomeRedirect() {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="sigab-session-loading">
        Verificando sesión...
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  switch (usuario.rol) {
    case "ESTUDIANTE":
      return (
        <Navigate
          to={ROUTES.ESTUDIANTE.HOME}
          replace
        />
      );

    case "SECRETARIO":
      return (
        <Navigate
          to={ROUTES.SECRETARIO.HOME}
          replace
        />
      );

    case "ADMINISTRADOR":
      return (
        <Navigate
          to={ROUTES.ADMINISTRADOR.HOME}
          replace
        />
      );

    default:
      return <Navigate to={ROUTES.LOGIN} replace />;
  }
}

export default HomeRedirect;