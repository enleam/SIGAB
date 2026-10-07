import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import "../styles/private.css";

const PrivateLayout = () => {
  const navigate = useNavigate();

  const {
    usuario,
    logout,
  } = useAuth();

  const irAlInicio = () => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    if (usuario.rol === "ESTUDIANTE") {
      navigate("/estudiante");
      return;
    }

    if (usuario.rol === "SECRETARIO") {
      navigate("/secretario");
      return;
    }

    if (usuario.rol === "ADMINISTRADOR") {
      navigate("/administrador");
    }
  };

  const cerrarSesion = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="private-layout">
      <header className="private-header">
        <button
          type="button"
          className="private-brand"
          onClick={irAlInicio}
        >
          SIGAB
        </button>

        {usuario && (
          <div className="private-user">
            <div className="private-user-info">
              <span className="private-user-email">
                {usuario.correo}
              </span>

              <span className="private-user-role">
                {usuario.rol}
              </span>
            </div>

            <button
              type="button"
              className="private-logout-button"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      {usuario && (
        <nav className="private-nav">
          {usuario.rol === "ESTUDIANTE" && (
            <>
              <NavLink
                to="/estudiante"
                end
                className={({ isActive }) =>
                  isActive
                    ? "private-nav-link active"
                    : "private-nav-link"
                }
              >
                Inicio
              </NavLink>

              <NavLink
                to="/estudiante/perfil"
                className={({ isActive }) =>
                  isActive
                    ? "private-nav-link active"
                    : "private-nav-link"
                }
              >
                Mi perfil
              </NavLink>
            </>
          )}

          {usuario.rol === "SECRETARIO" && (
            <NavLink
              to="/secretario"
              end
              className={({ isActive }) =>
                isActive
                  ? "private-nav-link active"
                  : "private-nav-link"
              }
            >
              Inicio
            </NavLink>
          )}

          {usuario.rol === "ADMINISTRADOR" && (
            <>
              <NavLink
                to="/administrador"
                end
                className={({ isActive }) =>
                  isActive
                    ? "private-nav-link active"
                    : "private-nav-link"
                }
              >
                Inicio
              </NavLink>

              <NavLink
                to="/administrador/secretarios"
                className={({ isActive }) =>
                  isActive
                    ? "private-nav-link active"
                    : "private-nav-link"
                }
              >
                Gestión de secretarios
              </NavLink>
            </>
          )}
        </nav>
      )}

      <main className="private-main">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;