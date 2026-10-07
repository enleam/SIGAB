export interface ConvocatoriaEvaluacion {
  id: number;
  titulo: string;
  estado: string;
  fechaLimite: string;
}

export interface PostulacionAnonimizada {
  codigoAnonimo: string;
  estado: string;
  fechaPostulacion: string;
  estadoAnonimizacion: string;
  cvAnonimizadoDisponible: boolean;
  archivoAnonimizadoId: number | null;
}

export interface EvaluacionConvocatoria {
  convocatoria: ConvocatoriaEvaluacion;
  postulaciones: PostulacionAnonimizada[];
}