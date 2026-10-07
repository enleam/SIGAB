import {
  Building2,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  MouseEvent as ReactMouseEvent,
} from "react";

import type { RolUsuario } from "../../types/auth";

import SidebarItem from "./SidebarItem";
import { getSidebarMenu } from "./sidebar-menu";

interface SidebarProps {
  rol: RolUsuario;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
}

const MIN_WIDTH = 220;
const DEFAULT_WIDTH = 270;
const MAX_WIDTH = 360;
const COLLAPSED_WIDTH = 72;

const STORAGE_COLLAPSED =
  "sigab.sidebar.collapsed";

const STORAGE_WIDTH =
  "sigab.sidebar.width";

function getInitialCollapsed(): boolean {
  return (
    window.localStorage.getItem(
      STORAGE_COLLAPSED,
    ) === "true"
  );
}

function getInitialWidth(): number {
  const storedWidth = Number(
    window.localStorage.getItem(
      STORAGE_WIDTH,
    ),
  );

  if (
    Number.isFinite(storedWidth) &&
    storedWidth >= MIN_WIDTH &&
    storedWidth <= MAX_WIDTH
  ) {
    return storedWidth;
  }

  return DEFAULT_WIDTH;
}

function Sidebar({
  rol,
  mobileOpen,
  onMobileClose,
  onLogout,
}: SidebarProps) {
  const [collapsed, setCollapsed] =
    useState<boolean>(getInitialCollapsed);

  const [width, setWidth] =
    useState<number>(getInitialWidth);

  const [resizing, setResizing] =
    useState(false);

  const sections = getSidebarMenu(rol);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_COLLAPSED,
      String(collapsed),
    );
  }, [collapsed]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_WIDTH,
      String(width),
    );
  }, [width]);

  useEffect(() => {
    if (!resizing || collapsed) {
      return;
    }

    const handleMouseMove = (
      event: MouseEvent,
    ) => {
      const nextWidth = Math.max(
        MIN_WIDTH,
        Math.min(
          MAX_WIDTH,
          event.clientX,
        ),
      );

      setWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setResizing(false);
    };

    document.body.classList.add(
      "sigab-sidebar-is-resizing",
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove,
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp,
    );

    return () => {
      document.body.classList.remove(
        "sigab-sidebar-is-resizing",
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove,
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp,
      );
    };
  }, [resizing, collapsed]);

  const handleResizeStart = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (collapsed) {
      return;
    }

    event.preventDefault();

    setResizing(true);
  };

  const handleToggleCollapsed = () => {
    setCollapsed(
      (currentValue) => !currentValue,
    );
  };

  const currentWidth = collapsed
    ? COLLAPSED_WIDTH
    : width;

  return (
    <aside
      className={[
        "sigab-sidebar",

        collapsed
          ? "sigab-sidebar--collapsed"
          : "",

        mobileOpen
          ? "sigab-sidebar--mobile-open"
          : "",

        resizing
          ? "sigab-sidebar--resizing"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: currentWidth,
      }}
    >
      <div className="sigab-sidebar__header">
        <div className="sigab-sidebar__brand">
          <div className="sigab-sidebar__brand-icon">
            <Building2
              size={22}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div className="sigab-sidebar__brand-text">
            <strong>SIGAB</strong>

            <span>
              Gestión de Bolsistas
            </span>
          </div>
        </div>

        <button
          type="button"
          className="sigab-sidebar__mobile-close"
          onClick={onMobileClose}
          aria-label="Cerrar menú"
          title="Cerrar menú"
        >
          <X
            size={21}
            strokeWidth={1.9}
          />
        </button>
      </div>

      <div className="sigab-sidebar__role">
        <span className="sigab-sidebar__role-label">
          Sesión
        </span>

        <span className="sigab-sidebar__role-value">
          {rol}
        </span>
      </div>

      <nav
        className="sigab-sidebar__navigation"
        aria-label="Navegación principal"
      >
        {sections.map((section) => (
          <section
            className="sigab-sidebar__section"
            key={section.title}
          >
            <span className="sigab-sidebar__section-title">
              {section.title}
            </span>

            <div className="sigab-sidebar__section-items">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onMobileClose}
                />
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="sigab-sidebar__footer">
        <button
          type="button"
          className="sigab-sidebar__logout"
          onClick={onLogout}
          aria-label="Cerrar sesión"
        >
          <LogOut
            size={20}
            strokeWidth={1.9}
            aria-hidden="true"
          />

          <span className="sigab-sidebar__logout-text">
            Cerrar sesión
          </span>

          {collapsed && (
            <span
              className="sigab-sidebar__tooltip"
              role="tooltip"
            >
              Cerrar sesión
            </span>
          )}
        </button>

        <button
          type="button"
          className="sigab-sidebar__collapse-button"
          onClick={handleToggleCollapsed}
          aria-label={
            collapsed
              ? "Expandir menú"
              : "Contraer menú"
          }
          title={
            collapsed
              ? "Expandir menú"
              : "Contraer menú"
          }
        >
          {collapsed ? (
            <PanelLeftOpen
              size={20}
              strokeWidth={1.9}
            />
          ) : (
            <>
              <PanelLeftClose
                size={20}
                strokeWidth={1.9}
              />

              <span>
                Contraer menú
              </span>
            </>
          )}
        </button>
      </div>

      {!collapsed && (
        <div
          className="sigab-sidebar__resizer"
          onMouseDown={handleResizeStart}
          role="separator"
          aria-orientation="vertical"
          aria-label="Cambiar ancho del menú"
        />
      )}
    </aside>
  );
}

export default Sidebar;