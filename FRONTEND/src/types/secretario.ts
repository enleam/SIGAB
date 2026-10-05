export interface Secretario {
  usuarioId: number;
  nombres: string;
  apellidos: string;
  correoInstitucional: string;
  estado: string;
  cargo: string | null;
}

export interface RegistrarSecretarioPayload {
  nombres: string;
  apellidos: string;
  correoInstitucional: string;
  cargo?: string | null;
}

export interface ActualizarSecretarioPayload {
  nombres: string;
  apellidos: string;
  correoInstitucional: string;
  cargo?: string | null;
}
