import { Menu } from "lucide-react";
import { useState } from "react";

import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import Sidebar from "../components/navigation/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../routes/paths";

import "../styles/private.css";
import "../styles/private-layout.css";

function PrivateLayout() {
  const {
    usuario,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  if (!usuario) {
    return null;
  }

  const cerrarSesion = () => {
    logout();

    navigate(
      ROUTES.LOGIN,
      {
        replace: true,
      },
    );
  };

  return (
    <div className="sigab-shell">
      <Sidebar
        rol={usuario.rol}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() =>
          setMobileSidebarOpen(false)
        }
        onLogout={cerrarSesion}
      />

      {mobileSidebarOpen && (
        <button
          type="button"
          className="sigab-shell__overlay"
          aria-label="Cerrar menú lateral"
          onClick={() =>
            setMobileSidebarOpen(false)
          }
        />
      )}

      <div className="sigab-shell__body">
        <header className="sigab-topbar">
          <div className="sigab-topbar__left">
            <button
              type="button"
              className="sigab-topbar__menu-button"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              aria-label="Abrir menú lateral"
            >
              <Menu
                size={22}
                strokeWidth={1.9}
              />
            </button>

            <div className="sigab-topbar__title">
              <strong>
                SIGAB
              </strong>

              <span>
                Sistema Integrado de Gestión y Asignación de Bolsistas
              </span>
            </div>
          </div>

          <div className="sigab-topbar__user">
            <div className="sigab-topbar__user-info">
              <span className="sigab-topbar__email">
                {usuario.correo}
              </span>

              <span className="sigab-topbar__role-mobile">
                {usuario.rol}
              </span>
            </div>

            <span className="sigab-topbar__role">
              {usuario.rol}
            </span>
          </div>
        </header>

        <main className="sigab-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PrivateLayout;