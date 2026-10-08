
export interface Facultad {
  id: number;
  nombre: string;
}

export interface Carrera {
  id: number;
  nombre: string;
}

export interface PerfilEstudiante {
  usuarioId: number;
  codigoEstudiante: string;

  nombres: string;
  apellidos: string;

  facultad: Facultad;
  carrera: Carrera;

  ciclo: number;
  telefono: string | null;

  // HU04 - Estado de completitud del perfil
  perfilCompleto: boolean;
  camposFaltantes: string[];
}
