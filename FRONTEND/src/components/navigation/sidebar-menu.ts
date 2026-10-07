import {
  House,
  UserRound,
  UsersRound,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { RolUsuario } from "../../types/auth";

import { ROUTES } from "../../routes/paths";

export interface SidebarMenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface SidebarMenuSection {
  title: string;
  items: SidebarMenuItem[];
}

const MENU_BY_ROLE: Record<
  RolUsuario,
  SidebarMenuSection[]
> = {
  ESTUDIANTE: [
    {
      title: "PRINCIPAL",
      items: [
        {
          label: "Inicio",
          path: ROUTES.ESTUDIANTE.HOME,
          icon: House,
          end: true,
        },
      ],
    },

    {
      title: "CUENTA",
      items: [
        {
          label: "Mi perfil",
          path: ROUTES.ESTUDIANTE.PERFIL,
          icon: UserRound,
        },
      ],
    },
  ],

  SECRETARIO: [
    {
      title: "PRINCIPAL",
      items: [
        {
          label: "Inicio",
          path: ROUTES.SECRETARIO.HOME,
          icon: House,
          end: true,
        },
      ],
    },
  ],

  ADMINISTRADOR: [
    {
      title: "PRINCIPAL",
      items: [
        {
          label: "Inicio",
          path: ROUTES.ADMINISTRADOR.HOME,
          icon: House,
          end: true,
        },
      ],
    },

    {
      title: "ADMINISTRACIÓN",
      items: [
        {
          label: "Gestión de secretarios",
          path: ROUTES.ADMINISTRADOR.SECRETARIOS,
          icon: UsersRound,
        },
      ],
    },
  ],
};

export function getSidebarMenu(
  rol: RolUsuario,
): SidebarMenuSection[] {
  return MENU_BY_ROLE[rol] ?? [];
}