import { NavLink } from "react-router-dom";

import type { SidebarMenuItem } from "./sidebar-menu";

interface SidebarItemProps {
  item: SidebarMenuItem;
  collapsed: boolean;
  onNavigate: () => void;
}

function SidebarItem({
  item,
  collapsed,
  onNavigate,
}: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      aria-label={item.label}
      className={({ isActive }) =>
        [
          "sigab-sidebar__link",
          isActive ? "is-active" : "",
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      <Icon
        className="sigab-sidebar__link-icon"
        size={20}
        strokeWidth={1.9}
        aria-hidden="true"
      />

      <span className="sigab-sidebar__link-text">
        {item.label}
      </span>

      {collapsed && (
        <span
          className="sigab-sidebar__tooltip"
          role="tooltip"
        >
          {item.label}
        </span>
      )}
    </NavLink>
  );
}

export default SidebarItem;